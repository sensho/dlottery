// require('dotenv').config();
// const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
// const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
// const web3 = createAlchemyWeb3(alchemyKey);

// const contractABI = require("../contract-abi.json");
// const contractAddress = "0x0e4f888677fe4ef5dbbe2345f44e37ab09ca9106";

// export const helloWorldContract = new web3.eth.Contract(
//     contractABI,
//     contractAddress
// );

// export const loadCurrentMessage = async () => {
//     console.log('here 00 ')
//     const message = await helloWorldContract.methods.getChannelPlayer().call();
//     return message;
// };

//next

import { useState } from "react";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";

let provider = typeof window !== "undefined" && window.ethereum;

const defaultAddress = '0x67F8B8d3203E2ec2b706c48EC35e91663393F7a7'

const getContract = async () => {
    console.log(provider)
    const web3 = new Web3(provider);
    const options = {
        gas: 300000000
    }
    // await ethereum.enable()
    return new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS, options);
};

// const getSignedContract = async () => {
//     const url = 'https://matic.getblock.io/678733c3-34e2-461b-a399-eaca7f39b419/testnet/'
//     const provider = new Web3.providers.HttpProvider(url)
//     const web3 = new Web3(provider);
//     const options = {
//         gas: 300000000
//     }
//     return new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS, options);
// }

let walletAddress

const connectMeta = async () => {
    try {
        if (!provider) return alert("Please Install MetaMask");

        const accounts = await provider.request({
            method: "eth_requestAccounts",
        });

        if (accounts.length) {
            console.log('connected', accounts[0])
            walletAddress = accounts[0]
        }
    } catch (error) {
        console.error(error);
    }
};

const createChannel = async (players, channelId, amount) => {
    return new Promise(async (resolve, reject) => {
        const contract = await getContract();
        console.log('contract -- ', contract)
        contract.methods
            .newChannel(parseInt(channelId), parseInt(players), parseInt(amount))
            .send({ from: walletAddress, gas: 3000000 })
            .then((res) => {
                console.log(res);
                resolve(res)
                // setStateVariable(res);
            })
            .catch((err) => { console.log(err); reject(err) });
    })

};

const joinGame = async (channelId, amount) => {
    return new Promise(async (resolve, reject) => {
        const contract = await getContract();
        const random_id = Math.floor(Math.random() * 10000)
        console.log('contract -- ', contract, channelId, amount, walletAddress, random_id)
        contract.methods
            .addPlayerToChannel(parseInt(channelId), random_id)
            .send({ from: walletAddress, value: amount * (1000000000000000000), gas: 3000000 })
            .then((res) => {
                console.log(res);
                resolve(res)
                // setStateVariable(res);
            })
            .catch((err) => { console.log(err); reject(err) });
    })
}

const endGame = async (channelId, amount) => {
    return new Promise(async (resolve, reject) => {
        const contract = await getContract();
        contract.methods
            .pickWinner(parseInt(channelId))
            .send({ from: walletAddress, gas: 3000000 })
            .then((res) => {
                console.log(res);
                resolve(res)
                // setStateVariable(res);
            })
            .catch((err) => { console.log(err); reject(err) });
    })
}

export { getContract, createChannel, connectMeta, joinGame, endGame }
