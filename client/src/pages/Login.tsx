import React, { useEffect, useState } from "react"
import "../styles/_login.scss"

import Web3 from 'web3'
import { InjectedConnector } from '@web3-react/injected-connector'
import MetaMaskOnboarding from '@metamask/onboarding'

import { POLYGON_TESTNET_PARAMS } from "../config/constants"
import { useNavigate } from "react-router-dom"
import Dashboard from "./Dashboard"
import { toast } from 'react-toastify';

import { loginUser } from "../services/login"
const ONBOARD_TEXT = 'Click here to install MetaMask!'
const CONNECT_WALLET = 'Connect Wallet'

declare var window: any

const abstractConnectorArgs = {
    supportedChainIds: [137, 80001]
}
const injected: InjectedConnector = new InjectedConnector(abstractConnectorArgs)


const Login = () => {

    const navigate = useNavigate()
    const [buttonText, setButtonText] = useState<string>('')

    // state to store the web3 instance
    const [web3, setWeb3] = useState<Web3 | null>(null)

    const [accounts, setAccounts] = useState<Array<string>>([])

    const [account, setCurrentAccount] = useState<string>('')
    const [balance, setBalance] = useState<String>('')
    const onboarding = React.useRef<MetaMaskOnboarding>()
    const [flashMessage, setFlashMsg] = useState<string>('')

    useEffect(() => {
        if (!onboarding.current) {
            // create an instance fo MetamaskOnboarding class when component mounts for the first time
            onboarding.current = new MetaMaskOnboarding()
        }
    }, [])

    // check for if user has metamask extension already installed on their browser
    useEffect(() => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            setButtonText(CONNECT_WALLET)
            onboarding.current?.stopOnboarding()
        } else {
            setButtonText(ONBOARD_TEXT)
        }
    }, [])

    // https://eips.ethereum.org/EIPS/eip-3085
    // Custom networks for Ethereum compatible chains can be added to Metamask
    async function addPolygonNetwork() {
        try {
            const provider = await injected.getProvider()
            // rpc request to switch chain to an ethereum compatible chain
            await provider.request({ method: 'wallet_addEthereumChain', params: [POLYGON_TESTNET_PARAMS] })

            // create web3 instance based on the provider
            const _web3 = new Web3(Web3.givenProvider)
            setWeb3(_web3)
            console.log(provider)
        } catch (e) {
            setFlashMsg('Failed to switch to Polygon chain, Please check your internet connect reconnect again')
            console.log(e)
        }
    }


    const handleAccounts = async (accounts: Array<string>) => {
        if (accounts.length === 0) {
            // MetaMask is locked or the user has not connected any accounts
            console.log('Please connect to MetaMask.')
            toast.error("Please connect to MetaMask")
        } else if (accounts[0] !== account) {
            let web3 = new Web3(window.ethereum);
            setCurrentAccount(accounts[0])
            setAccounts(accounts)
            const balance = await web3.eth.getBalance(accounts[0])
            setBalance(balance)
            localStorage.setItem("account", accounts[0])
            const resp = await loginUser(accounts[0])
            navigate('/dashboard')
        }
    }

    // connect initialize onboarding or connect wallet
    const onClick = async () => {
        if (MetaMaskOnboarding.isMetaMaskInstalled()) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
                handleAccounts(accounts)
            } catch (e) {
                console.log(e)
            }
        } else {
            // opens a new tab to the <chrome | firefox> store for user to install the MetaMask browser extension
            onboarding.current?.startOnboarding()
        }
    }

    return (
        <div className="login-main-div App">
            <div className="row login-div-row">
                <div className="col-sm-6 login-left-div">
                    <p className="dlottery-logo">DLottery</p>
                    <img alt="raffle" src="/raffle.png" />
                    <p className="welcome-text">Welcome to DLottery</p>
                    <p className="desc-text">A decentralised online game platform</p>

                </div>
                <div className="col-sm-6 login-right-div">
                    <p className="welcome-text">The only decentralised lottery platform on the blockchain.</p>
                    <p className="desc-text"> <span style={{ fontWeight: 'bold' }}>Raffle</span> - Is a gambling competition in which people obtain numbered tickets, each of which has the chance of winning a prize.
                        At a set time, the winners are drawn at random from a container holding a copy of each number. </p>
                    <p className="connect-wallet-text">Please connect your wallet to continue</p>

                    <button className="metamask-btn" onClick={() => onClick()} >
                        <img alt="metamask-logo" src="/fox.png" className="fox-img" />
                        {buttonText}
                    </button>
                    <button className="polygon-btn" onClick={() => addPolygonNetwork()}>Switch to Polygon Chain</button>
                </div>
            </div>
        </div>
    )
}

export default Login;