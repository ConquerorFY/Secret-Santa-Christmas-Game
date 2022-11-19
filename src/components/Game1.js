import React from "react";
import hands from "../images/hands-on-table.jpg";
import girlGift from "../images/red-present.jpg";
import boyGift from "../images/green-present.jpg";
import notesIndicator from "../images/gifts-amount-indicator.jpg";
import santaGoodieBag from "../images/santa-goodie-bag.jpg";

export default function Game1(props) {
    const [gameData, setGameData] = React.useState({
        "Boys": ["James", "John", "Andy"],
        "Girls": ["Mary", "Janesse", "Emilia"],
        "Attempts": 0,
        "Remaining": 6,
        "Validation": false,
        "isCorrect": false
    });
    const [currentName, setCurrentName] = React.useState("James");
    const [toggle, setToggle] = React.useState(false);
    let selection = "";

    function selectOption(event) {
        selection = event.target.getAttribute("value");
        checkAnswer();

        setTimeout(() => {
            setToggle(false);
        }, 1100);
    }

    function checkAnswer() {
        let isCorrect = false;
        if (gameData["Boys"].includes(currentName) && selection === "Boys") {
            isCorrect = true;
        } else if (gameData["Girls"].includes(currentName) && selection === "Girls") {
            isCorrect = true;
        } else {
            isCorrect = false;
        }

        setGameData(prevGameData => ({
            "Boys": isCorrect ? prevGameData["Boys"].filter((el) => el !== currentName) : prevGameData["Boys"],
            "Girls": isCorrect ? prevGameData["Girls"].filter((el) => el !== currentName) : prevGameData["Girls"],
            "Attempts": prevGameData["Attempts"] + 1,
            "Remaining": isCorrect ? prevGameData["Remaining"] - 1 : prevGameData["Remaining"],
            "Validation": true,
            "isCorrect": isCorrect
        }));
        setToggle(true);
    }

    React.useEffect(() => {
        setCurrentName(getRandomName());
    }, [gameData])

    function getRandomName() {
        let namesArray = [...gameData["Boys"], ...gameData["Girls"]];
        return namesArray[Math.floor(Math.random() * namesArray.length)];
    }

    function getRemainingNotes() {
        let el = [];
        let left = 0;
        let rotate = -40;
        for (let i = 0; i < gameData["Remaining"]; i++) {
            el.push(<img style={{ "left": `${left}px`, "transform": `rotate(${rotate}deg)` }} className="notes-amount" src={notesIndicator} alt="notes-amount-indicator" key={i} />);
            left += 10;
            rotate += 10;
        }

        return el;
    }

    return (
        <div className="game-1-container">
            {
                gameData["Remaining"] === 0 ? <div className="complete-notification">
                    <h1>Well Done!!</h1>
                    <h3>You have completed <span style={{ color: "white", fontStyle: "italic" }}>Quest 1!!</span></h3>
                    <h3>Please click on the <span style={{ color: "white", fontStyle: "italic" }}>Goodie Bag</span> to proceed!!</h3>
                    <button onClick={() => setGameData(prevGameData => ({
                        ...prevGameData,
                        "Remaining": -1,
                    }))}>Continue</button>
                </div> : ""
            }
            <div className="game-1-background" style={{ filter: gameData["Remaining"] === 0 ? "blur(10px)" : "" }}>
                {/* remove the span for same condition > 2 => (fixed) (conditional MUST CHANGE during each render to be re-rendered) */}
                <span className={`validation-message success-message ${gameData["Validation"] && gameData["isCorrect"] && toggle ? "fade-out" : ""}`}>Correct Answer!!</span>
                <span className={`validation-message error-message ${gameData["Validation"] && !gameData["isCorrect"] && toggle ? "fade-out" : ""}`}>Wrong Answer!!</span>
                <img className="hands" src={hands} alt="hands-on-table" />
                <div className="gift-selection">
                    <img className="girl-gift" src={girlGift} alt="girl-gifts" onClick={selectOption} value="Girls" />
                    <img className="boy-gift" src={boyGift} alt="boy-gifts" onClick={selectOption} value="Boys" />
                </div>
                {
                    gameData["Remaining"] > 0 ? <div className="recipient-name">
                        <span>{currentName}</span>
                    </div> : ""
                }
                <div className="notes-amount-indicator">
                    {getRemainingNotes()}
                </div>
                {
                    gameData["Remaining"] === 0 || gameData["Remaining"] === -1 ? <img className="goodie-bag" src={santaGoodieBag} alt="goodie-bag" onClick={() => props.selectGame(2)} /> : ""
                }
            </div>
        </div>
    )
}