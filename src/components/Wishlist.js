import React from "react";
import thumbs from "../images/thumbs-up.jpg";
import { crypt, decrypt } from "../hooks/useEncryption";

export default function Wishlist() {
    const [itemList, setItemList] = React.useState({});
    const [isSelected, setIsSelected] = React.useState("");
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    function handleInput(event) {
        setItemList(prevItemList => ({
            ...prevItemList,
            [event.target.name]: event.target.value,
        }));
    }
    function suggestionOptions(type) {
        if (isSelected === type) {
            setIsSelected("");
            return;
        }
        setIsSelected(type);
        switch (type) {
            case "beauty":
                setItemList({
                    "item-1": "Massager",
                    "item-2": "Humidifier",
                    "item-3": "Essential Oil"
                });
                break;
            case "living":
                setItemList({
                    "item-1": "Difuser",
                    "item-2": "Deco Items",
                    "item-3": "Appliances"
                });
                break;
            case "food":
                setItemList({
                    "item-1": "Mixed Nuts",
                    "item-2": "Coffee",
                    "item-3": "Cookies"
                });
                break;
            default:
                break;
        }
    }
    function submitWishlist() {
        // Guide: https://spin.atomicobject.com/2022/03/09/create-export-react-frontend/
        const fileData = crypt("salt", JSON.stringify(itemList));
        const blob = new Blob([fileData], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "wishlist.secret";
        link.href = url;
        link.click();
        setIsSubmitted(true);
    }
    document.querySelector(".main-container").style.overflow = "auto";
    // console.log(itemList);
    return isSubmitted ? window.location.reload() : (
        <div className="wishlist-container">
            <h1>Thanks for your help</h1>
            <h3>What a good child you have been!! As a token of appreciation, Santa would like to buy you a gift too.</h3>
            <h3>Please write down <span style={{ fontStyle: "italic", color: "orange" }}>3</span> items on the wishlist and Santa would buy <span style={{ fontStyle: "italic", color: "green" }}>1</span> out of them</h3>
            <div className="wishlist-options">
                <h4>Suggested Options: </h4>
                <div>
                    <div id="living" onClick={() => suggestionOptions("living")}
                        style={{ color: isSelected === "living" ? "white" : "", backgroundColor: isSelected === "living" ? "red" : "" }}>Home Living</div>
                    <div id="beauty" onClick={() => suggestionOptions("beauty")}
                        style={{ color: isSelected === "beauty" ? "white" : "", backgroundColor: isSelected === "beauty" ? "red" : "" }}>Beauty</div>
                    <div id="food" onClick={() => suggestionOptions("food")}
                        style={{ color: isSelected === "food" ? "white" : "", backgroundColor: isSelected === "food" ? "red" : "" }}>Food</div>
                </div>
            </div>
            <div className="wishlist-content-area">
                {
                    isSelected === "" ? <>
                        <div>
                            <label htmlFor="item-1">1.</label>
                            <input type="text" name="item-1" id="item-1" className="wishlist-input" placeholder="Item 1" onInput={handleInput} />
                        </div>
                        <div>
                            <label htmlFor="item-2">2.</label>
                            <input type="text" name="item-2" id="item-2" className="wishlist-input" placeholder="Item 2" onInput={handleInput} />
                        </div>
                        <div>
                            <label htmlFor="item-3">3.</label>
                            <input type="text" name="item-3" id="item-3" className="wishlist-input" placeholder="Item 3" onInput={handleInput} />
                        </div>
                    </> : <img src={thumbs} alt="thumbs-up" className="complete" />
                }
                <button className="submit" onClick={submitWishlist}>Confirm</button>
            </div>
        </div>
    )
}