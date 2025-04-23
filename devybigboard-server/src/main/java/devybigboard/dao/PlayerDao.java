package devybigboard.dao;

import devybigboard.models.Player;
import devybigboard.models.PlayerWithAdp;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

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
               ), -1) AS adp
        FROM players p
    """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> new PlayerWithAdp(
                        rs.getString("name"),
                        rs.getString("position"),
                        rs.getString("team"),
                        rs.getInt("draftyear"),
                        rs.getDouble("adp")
                )).stream()
                .sorted(Comparator.comparingDouble(PlayerWithAdp::adp)) // sort by ADP
                .toList();
    }

}