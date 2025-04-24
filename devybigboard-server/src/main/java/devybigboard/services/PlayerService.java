package devybigboard.services;

import devybigboard.dao.PlayerDao;
import devybigboard.models.Player;
import devybigboard.models.PlayerWithAdp;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
public class PlayerService {

    private final PlayerDao playerDao;

    public PlayerService(PlayerDao playerDao) {
        this.playerDao = playerDao;
    }

    public void saveDraftAdpResults(List<Player> draftedPlayers) {
        List<PlayerWithAdp> playersWithAdp = new ArrayList<>();
        for (int i = 0; i < draftedPlayers.size(); i++) {
            Player p = draftedPlayers.get(i);
            playersWithAdp.add(new PlayerWithAdp(
                    p.name(),
                    p.position(),
                    p.team(),
                    p.draftyear(),
                    i + 1 // ADP as pick number
            ));
        }

        // Step 1: Create new draft entry
        long draftId = playerDao.createDraft();

        // Step 2: Insert each pick
        playersWithAdp.forEach(playerWithAdp ->
                playerDao.insertDraftPickResult(draftId, playerWithAdp)
        );
    }

    public List<PlayerWithAdp> getAllPlayers() {
        return playerDao.getAllPlayers();
    }
}
