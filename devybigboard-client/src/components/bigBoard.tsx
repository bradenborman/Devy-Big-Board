import React, { useEffect, useState } from 'react';
import DraftSpot from './draftSpot';
import Toast from './Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

export interface Player {
    name: string;
    position: string;
    team: string;
    draftyear: number;
    adp: number;
}

interface BigBoardProps {
    teams: number;
    rounds: number;
    players: (Player | null)[][];
    removeDraftedPlayer: (row: number, col: number) => void;
    tierBreaks: { row: number; col: number }[];
}

const BigBoard: React.FC<BigBoardProps> = ({
    teams,
    rounds,
    players,
    removeDraftedPlayer,
    tierBreaks
}) => {

    const [completedDraftCount, setCompletedDraftCount] = useState(-1);

    useEffect(() => {
        fetch('/api/draft/count')
            .then(res => res.json())
            .then(data => {
                setCompletedDraftCount(data);
            })
            .catch(err => console.error("Error fetching draft count:", err));
    }, []);

    const isTierBreak = (row: number, col: number) =>
        tierBreaks.some((tb) => tb.row === row + 1 && tb.col === col + 1);

    return (
        <div className="big-board-wrapper">
            {/* <Toast message="Right click menu for more options" /> */}
            {/* <div className="big-board-header">
                <div className="help-icon-wrapper" tabIndex={0}>
                    <span className="help-label">
                        <FontAwesomeIcon icon={faCircleQuestion} style={{ marginRight: '6px' }} />
                        Need help?
                    </span>
                    <div className="help-content">
                        <p>👈 Click a player to add them to the board.</p>
                        <p>🗑️ Right click for more options.</p>
                        <p>🔻 Tier breaks help you separate talent tiers.</p>
                        <p>📨 Email: <a href="mailto:bradenborman00@gmail.com">Braden Borman</a> for more help</p>
                    </div>
                </div>
            </div> */}

            <div
                className="big-board"
                style={{ '--teams': teams, '--rounds': rounds } as React.CSSProperties}
            >
                {Array.from({ length: rounds }).map((_, rowIndex) => (
                    <div key={rowIndex} className="grid-row">
                        {Array.from({ length: teams }).map((_, colIndex) => (
                            <DraftSpot
                                key={colIndex}
                                player={players[rowIndex][colIndex]}
                                row={rowIndex + 1}
                                col={colIndex + 1}
                                removeDraftedPlayer={removeDraftedPlayer}
                                isTierBreak={isTierBreak(rowIndex, colIndex)}
                            />
                        ))}
                    </div>
                ))}
            </div>
{/* 
            <div className="big-board-footer">
                <p>
                    {completedDraftCount >= 0
                        ? `ADP powered by ${completedDraftCount} draft${completedDraftCount !== 1 ? 's' : ''}!`
                        : 'Loading ADP data...'}
                </p>
            </div> */}
        </div>
    );
};

export default BigBoard;
