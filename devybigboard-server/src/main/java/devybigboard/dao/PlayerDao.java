package devybigboard.dao;

import devybigboard.models.Player;
import devybigboard.models.PlayerWithAdp;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.Comparator;
import java.util.List;

@Repository
public class PlayerDao {

    private final JdbcTemplate jdbcTemplate;

    public PlayerDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Player> playerMapper = (rs, rowNum) -> new Player(
            rs.getString("name"),
            rs.getString("position"),
            rs.getString("team"),
            rs.getInt("draftyear")
    );

    public List<PlayerWithAdp> getAllPlayers() {
        String sql = """
    SELECT p.name, p.position, p.team, p.draftyear,
           COALESCE((
               SELECT AVG(pick_number)
               FROM draft_picks dp
               WHERE dp.name = p.name AND dp.position = p.position AND dp.team = p.team
           ), 999) AS adp
    FROM players p
    ORDER BY 
           COALESCE((
               SELECT AVG(pick_number)
               FROM draft_picks dp
               WHERE dp.name = p.name AND dp.position = p.position AND dp.team = p.team
           ), 999)
    """;


        return jdbcTemplate.query(sql, (rs, rowNum) -> new PlayerWithAdp(
                        rs.getString("name"),
                        rs.getString("position"),
                        rs.getString("team"),
                        rs.getInt("draftyear"),
                        rs.getDouble("adp")
                ));
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
                    "INSERT INTO drafts DEFAULT VALUES",
                    new String[] { "id" }
            );
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }


}