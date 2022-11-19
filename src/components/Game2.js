import React from "react";

import player from "../assets/christmas/Santa_Reindeer.png";

import bird1 from "../assets/christmas/Bird_Enemy_1.jpg";
import bird2 from "../assets/christmas/Bird_Enemy_2.jpg";
import cloud1 from "../assets/christmas/Cloud_1.png";
import cloud2 from "../assets/christmas/Cloud_2.png";
import cloud3 from "../assets/christmas/Cloud_3.png";
import house from "../assets/christmas/House_Target.png";

import candy from "../assets/christmas/Candy.png";
import smokeExplosion from "../assets/christmas/Smoke.png";

import layer1 from "../assets/christmas/Sky_Background_Resized.png";
import layer2 from "../assets/christmas/City_Midground_Resized.png";
import layer3 from "../assets/christmas/Houses_Foreground_Resized.png";

import useScript from "../hooks/useScript";
import Wishlist from "./Wishlist";


export default function Game2() {
    const [isFinished, setIsFinished] = React.useState(false);
    localStorage.setItem("Game Status", "0");
    useScript("js/Game2Script.js");

    function checkResult() {
        setTimeout(() => {
            if (localStorage.getItem("Game Status") * 1 > 0) {      // convert String (Number) to Integer
                setIsFinished(true);
                return;
            } else {
                checkResult();
            }
        }, 1000);
    }

    checkResult();
    return isFinished ? <Wishlist /> : (
        <div className="game-2-container">
            <canvas id="canvas1"></canvas>

            {/* <!-- Characters --> */}
            <img id="player" src={player} alt="player-img" />
            <img id="bird1" src={bird1} alt="bird1-img" />
            <img id="bird2" src={bird2} alt="bird2-img" />
            <img id="cloud1" src={cloud1} alt="cloud1-img" />
            <img id="cloud2" src={cloud2} alt="cloud2-img" />
            <img id="cloud3" src={cloud3} alt="cloud3-img" />
            <img id="house" src={house} alt="house-img" />

            {/* <!-- Props --> */}
            <img id="candy" src={candy} alt="candy-img" />
            <img id="smokeExplosion" src={smokeExplosion} alt="smoke-img" />

            {/* <!-- Environment --> */}
            <img id="layer1" src={layer1} alt="layer1-img" />
            <img id="layer2" src={layer2} alt="layer2-img" />
            <img id="layer3" src={layer3} alt="layer3-img" />
        </div>
    )
}