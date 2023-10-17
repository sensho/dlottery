import React, { useEffect, useState } from "react";
import "../styles/_dashboard.scss"
import { useNavigate } from "react-router-dom"
import { createNewGame, finishGame, getUnSeenGames, showActiveGames, unSeenView, userJoinGame } from "../services/dashboard";
import { connectMeta, createChannel, endGame, joinGame } from "../util/interact";
import { toast } from 'react-toastify';
import Loader from "../components/Loader";
import UnSeenModal from "../components/UnSeenModal";
import moment from "moment";

const Dashboard = () => {

    const [account, setAccount] = useState(localStorage.getItem("account"))
    const [modal, setModal] = useState<boolean>(false)
    const [players, setPlayers] = useState('2')
    const [game_name, setGameName] = useState('')
    const [amount, setAmount] = useState('')
    const [active, setActive] = useState([])
    const [your_games, setYourGames] = useState([])
    const [active_game, setActiveGame] = useState('game')
    const [finished_games, setFinishedGames] = useState([])
    const [join_game, setJoinGame] = useState<boolean>(false)
    const [selected_game, setGame] = useState<any>(undefined)
    const [game_won, setGameWon] = useState<any>(undefined)
    const [participants, setParticipants] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)
    const [loader_text, setLoaderText] = useState<string>("")
    const [unseen_games, setUnseenGames] = useState<any>([])
    const [unseen_modal, setUnseenModal] = useState<boolean>(false)

    const navigate = useNavigate()

    const logoutUser = () => {
        localStorage.removeItem("account")
        navigate('/')
    }

    const handleSelectChange = (val: string) => {
        setPlayers(val)
    }

    useEffect(() => {
        setLoader(true)
        setLoaderText("Loading dashboard")
        connectMeta();
        getGames()
        getUnSeenGamesFunc()
    }, [])

    const getUnSeenGamesFunc = async () => {
        const unseen: any = await getUnSeenGames()
        setUnseenGames(unseen.data.data)
        if (unseen.data.data.length > 0) {
            setUnseenModal(true)
        }
        if (unseen.data.data.length <= 0) {
            setUnseenModal(false)
        }
    }

    const closeSeen = async (raffle_id: string) => {
        const data: any = await unSeenView(raffle_id)
        if (data.status === 200) {
            getUnSeenGamesFunc()
        }
        else {
            setLoader(false)
            setLoaderText("")
            toast.error("Something went wrong! Please try again")
        }
    }

    const getGames = async () => {
        setLoader(true)
        setLoaderText("Please wait while we load your games!")
        const games: any = await showActiveGames()
        setActive(games.data.data.active_games)
        setYourGames(games.data.data.your_games)
        setFinishedGames(games.data.data.your_finished_games)
        setLoader(false)
        setLoaderText("")
        getUnSeenGamesFunc()
    }

    const createGame = async () => {
        try {
            setLoader(true)
            setLoaderText("Please wait while we create your game")
            const response: any = await createNewGame(players, game_name, amount)
            setModal(false)

            if (response.status === 200) {
                setLoaderText("Creating your game on the Polygon chain. This may take few seconds..")
                //code to call the smart contract
                const data: any = await createChannel(players, response.data.data.raffle_id, amount)
                setLoader(false)
                setLoaderText("")
                getGames()
            }
            else {
                setLoader(false)
                setLoaderText("")
                toast.error("Something went wrong! Please try again")
            }
        } catch (error: any) {
            console.log(error)
            toast.error(error.response.data.data)
        }
    }

    const joinGameFunc = async (raffle_id: string, amount: any) => {
        setJoinGame(false)
        setLoader(true)
        setLoaderText("Please sign the join request")
        setTimeout(() => {
            setLoaderText("You will be joining the game anytime now. Please wait while we tell the contract")
        }, 1000);
        const data: any = await joinGame(raffle_id, amount)
        if (data.status === true) {
            setJoinGame(false)
            setLoader(false)
            setLoaderText("")
            const game_data: any = await userJoinGame(selected_game._id)
            setLoader(false)
            // setLoaderText("")
            toast.success(`Joined game ${selected_game?.name} successfully`)
            if (game_data.data.data === selected_game?.players_number) {
                setLoader(true)
                setLoaderText("Please wait while the contract decides the winner")
                const end_game: any = await endGame(raffle_id)
                if (end_game.status === true) {
                    toast.success(`${selected_game.name} ended.`)
                    setGameWon(end_game.events.Withdraw[0].returnValues['_address'])
                    setLoader(false)
                    setLoaderText("")
                    const game_over: any = await finishGame(raffle_id, end_game.transactionHash, end_game.events.Withdraw[0].returnValues['_address'])
                    if (game_over.status === true) {
                        setLoader(false)
                        setLoaderText("")
                        toast.success(`Game ${selected_game?.name} ended successfully`)
                        setUnseenGames([{ "winner": { "wallet_id": end_game.events.Withdraw[0].returnValues['_address'] } }])
                        setUnseenModal(true)
                    }
                }
                else {
                    setLoader(false)
                    setLoaderText("")
                    toast.error("Something went wrong! Please try again")
                }
            }
            setLoader(true)
            setLoaderText("Please wait while we fetch your games!")
            setTimeout(() => {
                getGames()
            }, 3000);
        }
        else {
            setLoader(false)
            setLoaderText("")
            toast.error(`Joining ${selected_game?.name} failed. Please try again`)
        }
    }

    const getHostedData = (date: Date) => {
        const diff = moment(new Date()).diff(moment(date), 'days')
        if (diff === 0)
            return 'hosted today'
        else if (diff === 1)
            return 'hosted yesterday'
        else
            return `hosted on ${moment(date).format("DD MMM")}`
    }

    const expandNav = () => {
        const data = document.getElementById("navbarExpand")
        // data?.classList.add("expand")
        if (data?.classList.contains("expand")) {
            data.classList.remove("expand")
        }
        else
            data?.classList.add("expand")
    }

    return (
        <div className="dashboard-main-div">
            {unseen_modal === true && <UnSeenModal games={unseen_games} closeSeen={(game_id: string) => closeSeen(game_id)} />}
            {loader === true ?
                <Loader text={loader_text} />
                :
                <React.Fragment>
                    {
                        game_won === localStorage.getItem("account") &&
                        <div className="winner-modal create-game-modal-div">
                            <div className="winner-modal">
                                <p className="x-btn" onClick={() => setGameWon(undefined)}>X</p>
                                <img alt="confetti" src="/confetti.png" />
                                <p className="create-text">Congrajulations!</p>
                                <p className="won-confetti-text">You have won your last game! There are many more exciting prices waiting for you. Please join other games or you could create it own your own and take instant reward home. What are you waiting for? Get that rush going</p>
                            </div>
                        </div>
                    }
                    <div className="navbar-div">
                        <p className="dlottery">DLottery</p>
                        <div className="account-details">
                            <div className="reward-div">
                                <p className="reward-value">0</p>
                                <img alt="reward" src="/star.png" className="reward-img" />
                            </div>
                            <img alt="user" src="/user.png" className="navbar-user-img" onClick={() => expandNav()} />
                        </div>
                        <div className="navbar-expand" id="navbarExpand">
                            {/* <p>notification</p> */}
                            <p className="navbar-disabled-click">profile</p>
                            <p className="navbar-disabled-click">studio</p>
                            <p className="navbar-disabled-click">help</p>
                            <p className="navbar-click" onClick={() => logoutUser()}>logout</p>
                        </div>
                    </div>

                    <button className="create-game-btn" onClick={() => setModal(!modal)}>
                        {modal === false ? 'CREATE A GAME' : 'CLOSE'}
                    </button>

                    {
                        modal === true &&
                        <div className="create-game-modal-div">
                            <p className="x-btn" onClick={() => setModal(false)}>X</p>
                            <p className="create-text">Create a raffle game</p>
                            <div className="data-input-div">
                                <div className="data-input">
                                    <p>Game Name</p>
                                    <input type={'text'} onChange={(e) => setGameName(e.target.value)} />
                                </div>
                                <div className="data-input">
                                    <p>Number of Players ( 2 minimum )</p>
                                    <select onChange={(e) => handleSelectChange(e.target.value)}>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                        <option value={6}>6</option>
                                        <option value={7}>7</option>
                                        <option value={8}>8</option>
                                        <option value={9}>9</option>
                                        <option value={10}>10</option>
                                    </select>
                                </div>
                                <div className="data-input">
                                    <p>Amount ( In MATIC )</p>
                                    <input type={'number'} onChange={(e) => setAmount(e.target.value)} />
                                </div>
                            </div>
                            <button className="create-game-btn-modal" onClick={() => createGame()} >Create Game</button>
                        </div>
                    }

                    {
                        join_game === true &&
                        <div className="create-game-modal-div">
                            <p className="create-text">Join <span style={{ 'textTransform': 'uppercase' }}>{selected_game?.name}</span></p>
                            <div className="game-details-div">
                                <div className="row">
                                    <div className="col-sm-6 detail-div">
                                        <p className="detail">Game Name</p>
                                        <p className="value game-name-value">{selected_game?.name}</p>
                                    </div>
                                    <div className="col-sm-6 detail-div">
                                        <p className="detail">Player count</p>
                                        <p className="value">{selected_game?.participants.length}/{selected_game?.players_number}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6 detail-div">
                                        <p className="detail">bet Amount</p>
                                        <p className="value">{selected_game?.amount} MATIC</p>
                                    </div>
                                    <div className="col-sm-6 detail-div">
                                        <p className="detail">Host</p>
                                        <p className="value">{selected_game?.host.wallet_id.substring(0, 5)}... {selected_game?.host.wallet_id.substring(38, 42)} {selected_game?.host.wallet_id === localStorage.getItem("account") ? <span className="you-text">(YOU)</span> : ""}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="btn-div-row row">
                                <button className="btn-join-game pay-btn" onClick={() => joinGameFunc(selected_game?.raffle_id, selected_game?.amount)}>Pay {selected_game?.amount} MATIC <br /> <span className="join-game-txt">(Join {selected_game?.name} Game)</span> </button>
                                <button className="btn-join-game close-btn" onClick={() => setJoinGame(false)}>Close</button>
                            </div>
                        </div>
                    }

                    <div className="active-games-div">
                        <p className="active-text">Active Games &nbsp;
                            <img alt="info" src="/info.png" className="info-img" />
                        </p>
                        <div className="row">
                            {/* active games block */}
                            {active.length > 0 ?
                                <React.Fragment>
                                    {active.map((game: any) => {
                                        return (
                                            <div className="col-sm-3 game-div" key={game._id + Math.random()}>
                                                <div className="availability-dot"></div>
                                                <p className="name-text">{game.name}</p>
                                                <p className="hosted-text">{getHostedData(game.created_at)}</p>
                                                <p className={game.players_number - game.participants.length == 1 ? "one-spot-left-text" : "many-spots-left-text"}>
                                                    <span style={{ 'fontWeight': '600' }}>{game.players_number - game.participants.length} spot(s) left!</span> {'('}{game.participants.length}/{game.players_number}{')'}
                                                </p>
                                                <div className="min-amount-div">
                                                    <p><img alt="dollar-sign" className="dollar-sign-img" src="/dollar.png" />&nbsp;Bet Amount <span style={{ 'fontWeight': 600 }}>( MATIC )</span></p>
                                                    <p className="amount-value">{game.amount} MATIC</p>
                                                </div>
                                                <button className="join-game-btn" onClick={() => {
                                                    setJoinGame(true);
                                                    setGame(game);
                                                }
                                                } >JOIN GAME</button>
                                                {/* <button className="join-game-btn details-btn">DETAILS</button> */}
                                            </div>
                                        )
                                    })

                                    }
                                </React.Fragment>
                                :
                                <p className="join-game-text">No Active games now</p>
                            }
                        </div>
                    </div>

                    <div className="active-games-div your-games-div">
                        <div className="your-games-tab">
                            <p className="active-text">{active_game === "game" ? 'Your Games' : 'Your Previous Games'}</p>
                            <div className="game-tab-div">
                                <p onClick={() => setActiveGame('game')} className={active_game === "game" ? "active" : ''}>Ongoing</p>
                                <p onClick={() => setActiveGame('finished')} className={active_game === "finished" ? "active" : ''}>Finished</p>
                            </div>
                        </div>
                        {your_games.length > 0 || finished_games?.length > 0 ?
                            <div className="row">
                                {active_game === "game" ?
                                    <React.Fragment>
                                        {your_games.length > 0 ?
                                            <React.Fragment>
                                                {
                                                    your_games.map((game: any) => {
                                                        return (
                                                            <div className="col-sm-3 game-div" key={game._id + Math.random()}>
                                                                {/* <div className="availability-dot"></div> */}
                                                                <p className="name-text">{game?.name} - {game?.raffle_id}</p>
                                                                <p>Player count - {game?.participants.length}/{game?.players_number}</p>
                                                                <div className="min-amount-div">
                                                                    <p><img alt="dollar-sign" className="dollar-sign-img" src="/dollar.png" />Bet Amount <span style={{ 'fontWeight': 600 }}>( MATIC )</span></p>
                                                                    <p className="amount-value">{game?.amount} MATIC</p>
                                                                </div>
                                                                <p className="view-polygonscan" onClick={() => setParticipants(!participants)} >{participants === false ? 'View Participants' : 'Close'}</p>
                                                                {participants === true &&
                                                                    <div className="active-participants">
                                                                        <ul>
                                                                            {
                                                                                game.participants.map((participant: any, index: string) => {
                                                                                    return (
                                                                                        <li key={Math.random() + index} className={participant.wallet_id === localStorage.getItem('account') ? 'your-wallet-text' : ''} >
                                                                                            {participant.wallet_id !== localStorage.getItem('account') ? participant.wallet_id.substring(0, 10) + '...' + participant.wallet_id.substring(participant.wallet_id.length - 4, participant.wallet_id.length) : 'YOU'}
                                                                                        </li>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </ul>
                                                                    </div>
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </React.Fragment>
                                            :
                                            <p className="join-game-text">Please join any active game to get the experience</p>

                                        }
                                    </React.Fragment>
                                    :
                                    <React.Fragment>
                                        {finished_games.length > 0 ?
                                            <React.Fragment>
                                                {finished_games.map((game: any) => {
                                                    return (
                                                        <div className="col-sm-3 game-div" key={game._id + Math.random()}>
                                                            {/* <div className="availability-dot"></div> */}
                                                            {
                                                                game.winner.wallet_id === localStorage.getItem("account") &&
                                                                <img alt="winner" className="winner-img" src="/winner.png" />
                                                            }

                                                            <p className="name-text">{game?.name}</p>
                                                            {/* <p>Players - <span>{game?.participants.length}</span></p> */}
                                                            <div className="min-amount-div">
                                                                <p><img alt="dollar-sign" className="dollar-sign-img" src="/dollar.png" />&nbsp;Bet Amount ( MATIC )</p>
                                                                <p className="amount-value">{game?.amount} MATIC</p>
                                                            </div>
                                                            <p className="view-polygonscan"><a href={"https://mumbai.polygonscan.com/tx/" + game.blockHash} target="_blank">View on PolygonScan</a></p>
                                                            <p className="view-polygonscan" onClick={() => setParticipants(!participants)} >{participants === false ? 'View participants & winner' : 'Close'}</p>

                                                            {participants === true &&
                                                                <div className="active-participants">
                                                                    <ul>
                                                                        {
                                                                            game.participants.map((participant: any, index: string) => {
                                                                                return (
                                                                                    <li key={Math.random() + index} className={participant.wallet_id === localStorage.getItem('account') ? 'your-wallet-text' : ''} >
                                                                                        {participant.wallet_id !== localStorage.getItem('account') ? participant.wallet_id.substring(0, 10) + '...' + participant.wallet_id.substring(participant.wallet_id.length - 4, participant.wallet_id.length) : 'YOU'}&nbsp;
                                                                                        {participant.wallet_id === game.winner.wallet_id && <img className="crown-img" alt="winner" src="/crown.png" />}
                                                                                    </li>
                                                                                )
                                                                            })
                                                                        }
                                                                    </ul>
                                                                </div>
                                                            }
                                                        </div>
                                                    )
                                                })
                                                }
                                            </React.Fragment>
                                            :
                                            <p className="join-game-text">You haven't played a game yet. Go to Active Games section and play one</p>
                                        }
                                    </React.Fragment>
                                }
                            </div>
                            :
                            <p className="join-game-text">Please join a game to get the experience</p>
                        }
                    </div>
                </React.Fragment>
            }
        </div >
    )
}

export default Dashboard;