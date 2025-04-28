package devybigboard.controllers;

import devybigboard.models.CompletedDraftResponse;
import devybigboard.models.LeagueFilter;
import devybigboard.models.Player;
import devybigboard.models.PlayerWithAdp;
import devybigboard.services.DevyBoardService;
import devybigboard.services.DraftService;
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

    @GetMapping("/filters")
    public List<LeagueFilter> getAllFilters() {
        return draftService.getAllLeagueFilters();
    }

    @PostMapping("/filters")
    public long createFilter(@RequestBody String leagueName) {
        return draftService.createLeagueFilter(leagueName);
    }

    @PostMapping("/filters/{filterId}/add")
    public void addPlayerToFilter(
            @PathVariable long filterId,
            @RequestBody Player player
    ) {
        draftService.addPlayerToFilter(filterId, player);
    }

    @PostMapping("/filters/{filterId}/remove")
    public void removePlayerFromFilter(
            @PathVariable long filterId,
            @RequestBody Player player
    ) {
        draftService.removePlayerFromFilter(filterId, player);
    }

    @GetMapping("/players/filter/{filterId}")
    public List<PlayerWithAdp> getPlayersExcludingFilter(@PathVariable long filterId) {
        return devyBoardService.getPlayersExcludingFilter(filterId);
    }

    @DeleteMapping("/filters/{filterId}")
    public void deleteFilter(@PathVariable long filterId) {
        draftService.deleteLeagueFilter(filterId);
    }


}