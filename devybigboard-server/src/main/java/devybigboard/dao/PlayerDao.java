package devybigboard.dao;

import devybigboard.models.Player;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Repository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.Year;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class PlayerDao {

    private static final  Logger logger = LoggerFactory.getLogger(PlayerDao.class);

    public List<Player> getAllPlayers() {
        List<Player> allPlayers = new ArrayList<>();
        int currentYear = Year.now().getValue();

        try {
            var resolver = new PathMatchingResourcePatternResolver();
            Resource[] resources = resolver.getResources("classpath:players/*.txt");

            for (Resource resource : resources) {
                String filename = resource.getFilename();
                if (!filename.matches("\\d{4}\\.txt")) continue;

                int fileYear = Integer.parseInt(filename.substring(0, 4));
                if (fileYear >= currentYear) {
                    try (var reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
                        reader.lines()
                                .map(String::trim)
                                .filter(line -> !line.isEmpty())
                                .map(line -> parseLine(line, fileYear))
                                .forEach(allPlayers::add);
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to load players", e);
        }

        return allPlayers.stream()
                .collect(Collectors.toMap(
                        Player::name,
                        p -> p,
                        (existing, replacement) -> existing,
                        java.util.LinkedHashMap::new // preserve file order
                ))
                .values()
                .stream()
                .sorted(Comparator.comparingInt(p -> positionOrder(p.position())))
                .toList();


    }

    private Player parseLine(String line, int year) {
        String[] parts = line.split("\\s*\\|\\s*");
        if (parts.length != 5) {
            throw new IllegalArgumentException("Invalid player line: " + line);
        }

        return new Player(
                parts[0],                            // name
                parts[1],                            // position
                Integer.parseInt(parts[2]),          // age
                parts[3],                            // team
                year           // year
        );
    }

    private static int positionOrder(String position) {
        return switch (position) {
            case "QB" -> 0;
            case "RB" -> 1;
            case "WR" -> 2;
            case "TE" -> 3;
            default -> 4;
        };
    }


}
