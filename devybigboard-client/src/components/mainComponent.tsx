import React, { useEffect, useState } from 'react';
import BigBoard, { Player } from './bigBoard';
import PlayerList from './playerList';
import BoardParameters from './boardParametes';
// import { initialPlayerPool } from '../data/players';

const MainComponent: React.FC = () => {

    const [teams, setTeams] = useState<number>(12);
    const [rounds, setRounds] = useState<number>(3);
    const [isGridCreated, setIsGridCreated] = useState<boolean>(false);
    const [players, setPlayers] = useState<(Player | null)[][]>([]);
    const [playerPool, setPlayerPool] = useState<Player[]>([]);


    //Todo - remove for final
    // useEffect(() => { createGrid() }, [])


    const setDefaultPlayerPool = () => {
        fetch("/api/players")
            .then((res) => res.json())
            .then((data: Player[]) => setPlayerPool(data))
            .catch((err) => console.error("Failed to fetch players:", err));
    }

    useEffect(() => {
        setDefaultPlayerPool();
    }, []);


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
        setDefaultPlayerPool();
        setPlayers(Array.from({ length: rounds }, () => Array(teams).fill(null)));
    };

    const exportDraft = () => {
        let draftText = "<h2>Rookie Fantasy Football Draft Order:</h2><ul>";

        players.forEach((row, rIndex) => {
            if (rIndex > 0) {
                draftText += "<br>"; // Add spacing between rounds
            }
            row.forEach((player, cIndex) => {
                const round = rIndex + 1;
                const pick = cIndex + 1;
                draftText += `<li>${round}.${pick.toString().padStart(2, '0')} ${player ? player.name : '---'}</li>`;
            });
        });

        draftText += "</ul>";

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>Draft Order</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h2 { text-align: center; margin-top:0px;}
                        ul { list-style-type: none; padding: 0; }
                        li { font-size: 18px; margin: 5px 0; }
                        @media print {
                            @page { margin: 0; }
                            body { margin: 1in; }
                        }
                    </style>
                </head>
                <body>
                    ${draftText}
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const downloadText = () => {
        let draftText = "Rookie Fantasy Football Draft Order:\n\n";

        players.forEach((row, rIndex) => {
            row.forEach((player, cIndex) => {
                const round = rIndex + 1;
                const pick = cIndex + 1;
                draftText += `${round}.${pick.toString().padStart(2, '0')} ${player ? player.name : '---'}\n`;
            });
        });

        const blob = new Blob([draftText], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'rookie_draft_order.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                        exportDraft={exportDraft}
                    />
                </div>
            )}
        </div>
    );
};

export default MainComponent;