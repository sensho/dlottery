export const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "chanelnumber",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "playerId",
				"type": "uint256"
			}
		],
		"name": "addPlayerToChannel",
		"outputs": [
			{
				"internalType": "bool",
				"name": "message",
				"type": "bool"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_raffleId",
				"type": "uint256"
			}
		],
		"name": "Deposit",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "chanelnumber",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "maxPlayers",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "newChannel",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "chanelnumber",
				"type": "uint256"
			}
		],
		"name": "pickWinner",
		"outputs": [
			{
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "servicefee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "prices",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "_address",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_raffleId",
				"type": "uint256"
			}
		],
		"name": "Withdraw",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "chanelnumber",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "playerId",
				"type": "uint256"
			}
		],
		"name": "getChannelPlayer",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "playerId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "playerAddr",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					}
				],
				"internalType": "struct RaffleContract.Player",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "manager",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "player",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "playerId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "playerAddr",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "players",
				"type": "uint256[]"
			}
		],
		"name": "random",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

// export const CONTRACT_ADDRESS = "0x0e4f888677fe4ef5dbbe2345f44e37ab09ca9106"
// export const CONTRACT_ADDRESS = "0x5e20c8ed3faa897d3580c5693100e234ae745728";
export const CONTRACT_ADDRESS = "0xe13eae945f8dc96a1444a21dbd74aaba2fff5fd7";
// export const DEFAULT_ADDRESS = 