package devybigboard.dao;

import devybigboard.models.CompletedDraftResponse;
import devybigboard.models.PlayerWithAdp;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;

@Repository
public class DraftDao {

    private final JdbcTemplate jdbcTemplate;

    public DraftDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public int draftsCompletedCount() {
        String sql = """
        SELECT COUNT(DISTINCT draft_id)
        FROM draft_picks
        """;
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

    public String queryForUUID(long draftId) {
        String sql = "SELECT uuid FROM drafts WHERE id = ?";

        return jdbcTemplate.queryForObject(
                sql,
                String.class,
                draftId
        );
    }



    public void insertDraftPickResult(long draftId, PlayerWithAdp playerWithAdp) {
        String sql = """
        INSERT INTO draft_picks (draft_id, pick_number, name, position, team)
        VALUES (?, ?, ?, ?, ?)
    """;

        jdbcTemplate.update(sql,
                draftId,
                playerWithAdp.adp(),
                playerWithAdp.name(),
                playerWithAdp.position(),
                playerWithAdp.team()
        );
    }


    public long createDraft() {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    """
                    INSERT INTO drafts (created_at, draft_date, draft_time, type, uuid)
                    VALUES (NOW(), CURRENT_DATE(), CURRENT_TIME(), 'offline', UUID())
                    """,
                    new String[]{"id"}
            );
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }


    public CompletedDraftResponse draftByUUID(String uuid) {
        String picksSql = """
        SELECT draft_id, pick_number, name, position, team
        FROM draft_picks
        WHERE draft_id = (SELECT id FROM drafts WHERE uuid = ?)
        ORDER BY pick_number ASC
    """;

        var picks = jdbcTemplate.query(picksSql, (rs, rowNum) -> new devybigboard.models.DraftPick(
                rs.getLong("draft_id"),
                rs.getInt("pick_number"),
                rs.getString("name"),
                rs.getString("position"),
                rs.getString("team")
        ), uuid);

        if (picks.isEmpty()) {
            throw new RuntimeException("No draft picks found for UUID: " + uuid);
        }

        // Step 2: Lookup draft metadata
        long draftId = picks.get(0).draftId(); // first pick's draft_id

        String draftSql = """
        SELECT id, created_at, draft_date, draft_time, type, uuid
        FROM drafts
        WHERE id = ?
    """;

        return jdbcTemplate.queryForObject(draftSql, (rs, rowNum) -> new CompletedDraftResponse(
                rs.getLong("id"),
                rs.getTimestamp("created_at").toInstant(),
                rs.getDate("draft_date").toLocalDate(),
                rs.getTime("draft_time").toLocalTime(),
                rs.getString("type"),
                rs.getString("uuid"),
                picks // <= you now pass picks into the CompletedDraftResponse
        ), draftId);
    }


}