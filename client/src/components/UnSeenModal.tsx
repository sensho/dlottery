import React, { useEffect, useState } from "react"
import "../styles/_loader.scss"

const UnSeenModal = (props: { games: any, closeSeen: any }) => {
    return (
        <div className="winner-modal create-game-modal-div">
            <div className="winner-modal">
                {/* <p className="x-btn" onClick={() => props.closeSeen()}>X</p> */}
                <img alt="confetti" src="/confetti.png" />
                <p className="create-text">{props.games[0].winner?.wallet_id === localStorage.getItem("account") ? `Congrajulations, You won the game - ${props.games[0].name}!` : `Oops! Seems like you didn't win '${props.games[0].name}' game!`}</p>
                <p className="won-confetti-text">{props.games[0].winner?.wallet_id === localStorage.getItem("account") ? 
                "You have won your last game! There are many more exciting games and money up for grabs. Please join other games or you could create it own your own and take instant reward home. What are you waiting for? Get that cash flowin'!" 
                : `Don't worry! It's just bad luck here. But the day doesn't end here, you can still get back everything by playing another one. What are you waiting for? Go ahead, create a game or join a game for winning more money`}</p>
                <button className="unseen-close-btn" onClick={() => props.closeSeen(props.games[0]._id)}>Close</button>
            </div>
        </div>
    )
}

export default UnSeenModal;