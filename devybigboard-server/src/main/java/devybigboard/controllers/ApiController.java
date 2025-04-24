package devybigboard.controllers;

import devybigboard.dao.PlayerDao;
import devybigboard.models.Player;
import devybigboard.models.PlayerWithAdp;
import devybigboard.services.DraftService;
import devybigboard.services.PlayerService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final PlayerService playerService;
    private final DraftService draftService;

    public ApiController(PlayerService playerService, DraftService draftService) {
        this.playerService = playerService;
        this.draftService = draftService;
    }

    @GetMapping("/draft/count")
    public Integer draftsCompletedCount() {
        return draftService.draftsCompletedCount();
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