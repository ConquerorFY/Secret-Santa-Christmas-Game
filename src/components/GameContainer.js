import React from "react";
import Game1 from "./Game1";
import Game2 from "./Game2";

export default function GameContainer(props) {
    const [start, setStart] = React.useState(false);
    const gameDescription = {
        "Game1": <div className="game-description-1">
            <h1>Quest 1: Help Santa to Sort the Presents</h1>
            <h3>Ho Ho Ho! Christmas is coming and Santa is busy preparing gifts for all the children</h3>
            <h3>However, Santa is having a hard time to figure out which gifts shouls be given to the different children</h3>
            <h3>Could you help Santa out in sorting gifts for the different children?</h3>
            <p>Instructions: Click on the <span style={{ color: "red", fontStyle: "italic" }}>Red Present</span> if the child's name belongs to a <span style={{ fontStyle: "italic", textDecorationLine: "underline" }}>Girl</span>, otherwise click on the <span style={{ color: "green", fontStyle: "italic" }}>Green Present</span> if it belongs to a <span style={{ fontStyle: "italic", textDecorationLine: "underline" }}>Boy</span></p>

            <button onClick={toggleGame}>Let's Go</button>
        </div>,
        "Game2": <div className="game-description-2">
            <h1>Quest 2: Help Guide Santa in Delivering the Presents</h1>
            <h3>Thanks to your help, Santa has finished preparing gifts for all the children!</h3>
            <h3>Santa and his reindeers Radahn and Ranni are now preparing to hand out gifts to the children. </h3>
            <h3>Could you guide Santa and his reindeers in their travels to successful deliver the gifts?</h3>
            <p>Instructions: Move up (<span style={{ color: "orange", fontStyle: "italic", textDecorationLine: "underline" }}>↑ key</span>) or move down (<span style={{ color: "green", fontStyle: "italic", textDecorationLine: "underline" }}>↓ key</span>) to avoid the birds or clouds that will reduce health. Collide with the houses to gain score points. If score is greater than 6, you win. If the health is less than 1, you lose.</p>

            <button onClick={toggleGame}>Let's Go</button>
        </div>

    }
    const game = props.game === 1 ? <Game1 selectGame={selectGame} />
        : props.game === 2 ? <Game2 selectGame={selectGame} />
            : "";

    function toggleGame() {
        setStart(prevStart => !prevStart);
    }

    function selectGame(option) {
        props.selectGame(option);
        toggleGame();
    }

    return (
        <div className="game-container">
            {
                start ? game
                    : props.game === 1 ? gameDescription["Game1"]
                        : props.game === 2 ? gameDescription["Game2"]
                            : ""
            }
        </div>
    )
}