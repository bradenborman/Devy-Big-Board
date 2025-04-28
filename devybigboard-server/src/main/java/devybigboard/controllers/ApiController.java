package devybigboard.controllers;

import devybigboard.models.CompletedDraftResponse;
import devybigboard.models.Player;
import devybigboard.models.PlayerWithAdp;
import devybigboard.services.DraftService;
import devybigboard.services.DevyBoardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final DevyBoardService devyBoardService;
    private final DraftService draftService;

    public ApiController(DevyBoardService devyBoardService, DraftService draftService) {
        this.devyBoardService = devyBoardService;
        this.draftService = draftService;
    }

    @GetMapping("/draft/count")
    public Integer draftsCompletedCount() {
        return draftService.draftsCompletedCount();
    }

    @GetMapping("/players")
    public List<PlayerWithAdp> allPlayers() {
        return devyBoardService.getAllPlayers();
    }

    @PostMapping("/draft/complete")
    public String draftComplete(@RequestBody List<Player> draftedPlayers) {
       return devyBoardService.saveDraftAdpResults(draftedPlayers);
    }

    @GetMapping("draft/{uuid}")
    public CompletedDraftResponse getDraftByUuid(@PathVariable String uuid) {
        return devyBoardService.getDraftByUuid(uuid);
    }

}