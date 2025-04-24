package devybigboard.controllers;

import devybigboard.dao.PlayerDao;
import devybigboard.models.Player;
import devybigboard.models.PlayerWithAdp;
import devybigboard.services.PlayerService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final PlayerService playerService;

    public ApiController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping("/players")
    public List<PlayerWithAdp> allPlayers() {
        return playerService.getAllPlayers();
    }

    @PostMapping("/draft/complete")
    public void draftComplete(@RequestBody List<Player> draftedPlayers) {
       playerService.saveDraftAdpResults(draftedPlayers);
    }


}