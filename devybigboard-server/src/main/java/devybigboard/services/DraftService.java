package devybigboard.services;

import devybigboard.dao.DraftDao;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DraftService {

    private final DraftDao draftDao;

    public DraftService(DraftDao draftDao) {
        this.draftDao = draftDao;
    }

    public Integer draftsCompletedCount() {
       return draftDao.draftsCompletedCount();
    }

}