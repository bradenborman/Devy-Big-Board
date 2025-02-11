import React, { useState } from 'react';
import BigBoard, { Player } from './bigBoard';
import PlayerList from './playerList';
import BoardParameters from './boardParametes';
import { initialPlayerPool } from '../data/players';

const MainComponent: React.FC = () => {

    const [teams, setTeams] = useState<number>(12);
    const [rounds, setRounds] = useState<number>(3);
    const [isGridCreated, setIsGridCreated] = useState<boolean>(false);
    const [players, setPlayers] = useState<(Player | null)[][]>([]);
    const [playerPool, setPlayerPool] = useState<Player[]>(initialPlayerPool);

    const createGrid = () => {
        setPlayers(Array.from({ length: rounds }, () => Array(teams).fill(null)));
        setIsGridCreated(true);
    };

    const addPlayerToNextOpenSpot = (player: Player) => {
        setPlayers((prevPlayers) => {
            const updatedPlayers = prevPlayers.map((rowArr) => [...rowArr]);

            for (let r = 0; r < rounds; r++) {
                for (let c = 0; c < teams; c++) {
                    if (!updatedPlayers[r][c]) {
                        updatedPlayers[r][c] = player;
                        setPlayerPool((prevPool) => prevPool.filter((p) => p.name !== player.name));
                        return updatedPlayers;
                    }
                }
            }
            return prevPlayers;
        });
    };

    const removeDraftedPlayer = (row: number, col: number) => {
        setPlayers((prevPlayers) => {
            const updatedPlayers = prevPlayers.map((rowArr) => [...rowArr]);
            const playerToRemove = updatedPlayers[row - 1][col - 1];
            if (playerToRemove) {
                updatedPlayers[row - 1][col - 1] = null;
                setPlayerPool((prevPool) => [...prevPool, playerToRemove]);
            }
            return updatedPlayers;
        });
    };

    const clearBoard = () => {
        setPlayerPool(initialPlayerPool);
        setPlayers(Array.from({ length: rounds }, () => Array(teams).fill(null)));
    };


    return (
        <div className={`main-component ${!isGridCreated ? 'center-content' : ''}`}>
            {!isGridCreated ? (
                <BoardParameters
                    teams={teams}
                    rounds={rounds}
                    handleTeamsChange={(e) => setTeams(Number(e.target.value))}
                    handleRoundsChange={(e) => setRounds(Number(e.target.value))}
                    createGrid={createGrid}
                />
            ) : (
                <div className="board-container">
                    <PlayerList playerPool={playerPool} addPlayerToNextOpenSpot={addPlayerToNextOpenSpot} />
                    <BigBoard
                        rounds={rounds}
                        teams={teams}
                        players={players}
                        addPlayerToSpot={() => { }}
                        removeDraftedPlayer={removeDraftedPlayer}
                        clearBoard={clearBoard}
                    />
                </div>
            )}
        </div>
    );
};

export default MainComponent;