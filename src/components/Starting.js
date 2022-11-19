import React from 'react';
import santa2 from "../images/santa-animation-2.gif";
import christmasTree from "../images/christmas-tree.png";

export default function Starting(props) {
    return (
        <div className="starting-container">
            <div id="snowfall"></div>
            <img id="santa-2" src={santa2} alt="santa-animation-2" />
            <img id="christmas-tree" src={christmasTree} alt="christmas-tree" />
            <h1>Merry Christmas!!</h1>
            <h3>
                Hey there! Feeling a little playful? Come try out this awesome little christmas game that I have designed!
            </h3>
            <h4>
                (: from your secret santa -
            </h4>
            <button onClick={props.start}>Continue</button>
        </div>
    )
}