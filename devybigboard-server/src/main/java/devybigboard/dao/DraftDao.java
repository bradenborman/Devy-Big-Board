package devybigboard.dao;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

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

}