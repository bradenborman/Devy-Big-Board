import React, { useState } from 'react';
import { Player } from './bigBoard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons';


interface PlayerListProps {
    playerPool: Player[];
    addPlayerToNextOpenSpot: (player: Player) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({ playerPool, addPlayerToNextOpenSpot }) => {
    const [activePositionFilters, setActivePositionFilters] = useState<string[]>([]);
    const [activeYearFilters, setActiveYearFilters] = useState<number[]>([]);

    const [playerListOpen, setPlayerListOpen] = useState<boolean>(true);

    const currentYear = new Date().getFullYear();
    const yearRange = Array.from({ length: 4 }, (_, i) => currentYear + i);


    const togglePositionFilter = (position: string) => {
        if (position === 'ALL') {
            setActivePositionFilters([]);
        } else {
            setActivePositionFilters((prev) =>
                prev.includes(position) ? prev.filter((p) => p !== position) : [...prev, position]
            );
        }
    };

    const toggleYearFilter = (year: number) => {
        setActiveYearFilters((prev) =>
            prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
        );
    };

    const filteredPlayers = playerPool.filter((player) => {
        const matchesPosition =
            activePositionFilters.length === 0 || activePositionFilters.includes(player.position);
        const matchesYear =
            activeYearFilters.length === 0 || activeYearFilters.includes(player.draftyear);
        return matchesPosition && matchesYear;
    });

    return (
        <div className={`player-list ${playerListOpen ? 'open' : 'collapsed'}`}>
            <div className="collapse-wrapper" onClick={() => setPlayerListOpen(!playerListOpen)}>
                <span>
                    {playerListOpen ? 'Full Draft Board' : 'Show Player List'}
                </span>
                <FontAwesomeIcon icon={playerListOpen ? faTableCellsLarge : faUsers} size="lg" />
            </div>


            <div className="filters">
                <button
                    className={`filter-btn ${activePositionFilters.length === 0 ? 'active' : ''}`}
                    onClick={() => togglePositionFilter('ALL')}
                >
                    All
                </button>
                {['QB', 'RB', 'WR', 'TE'].map((position) => (
                    <button
                        key={position}
                        className={`filter-btn ${activePositionFilters.includes(position) ? 'active' : ''}`}
                        onClick={() => togglePositionFilter(position)}
                    >
                        {position}
                    </button>
                ))}
            </div>
            <div className="filters">
                {yearRange.map((year) => (
                    <button
                        key={year}
                        className={`filter-btn ${activeYearFilters.includes(year) ? 'active' : ''}`}
                        onClick={() => toggleYearFilter(year)}
                    >
                        {year}
                    </button>
                ))}
            </div>
            <div className='scroll-list'>
                <ul>
                    {filteredPlayers.length === 0 ? (
                        <li className="empty-list">No players left</li>
                    ) : (
                        filteredPlayers.map((player, index) => (
                            <li key={index} className="player-entry">
                                <span className="player-position">{player.position}</span>
                                <span className="player-name"> {player.name}<span className="player-adp">{player.adp.toFixed(1)}</span>
                                </span>
                                <button className="add-btn" onClick={() => addPlayerToNextOpenSpot(player)}>
                                    +
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default PlayerList;