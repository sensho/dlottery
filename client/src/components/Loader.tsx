import React, { useEffect, useState } from "react"
import "../styles/_loader.scss"


const Loader = (props: { text: string }) => {

    return (
        <div className="loader-main-div">
            <div className="loader-data">
                <img alt="loading-icon" src="/loader.gif" />
                <p>{props.text}</p>
            </div>
        </div>
    )
}

export default Loader;