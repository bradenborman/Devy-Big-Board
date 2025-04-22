package devybigboard.controllers;

import devybigboard.dao.PlayerDao;
import devybigboard.models.Player;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final PlayerDao playerDao;

    public ApiController(PlayerDao playerDao) {
        this.playerDao = playerDao;
    }

    @GetMapping("/players")
    public List<Player> allPlayers() {
        return playerDao.getAllPlayers();
    }

}