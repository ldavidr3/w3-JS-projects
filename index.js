import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")

const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

connectButton.click = connect()

fundButton.click = fund()

balanceButton.click = getBalance()

withdrawButton.click = withdraw()

console.log(ethers)

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        console.log("Withdrawing")
        try {
            const txnResponse = await contract.withdraw()
            await listenForTxnMined(txnResponse, provider)
            console.log("DONE!")
        } catch (error) {
            console.log(error)
        }
    }
}

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        document.getElementById("connectButton").innerHTML = "Connected"
    } else {
        document.getElementById("connectButton").innerHTML =
            "Pls install Metamask"
    }

    return console.log("hi")
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function fund() {
    let ethAmount = document.getElementById("ethAmount").value

    console.log(`Funding with ${ethAmount}`)

    if (typeof window.ethereum !== "undefined") {
        // provider / connection to the blockchain
        // signer / wallet someone with some gas
        // contract that we are interacting with
        // ABI & Address
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const txnResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTxnMined(txnResponse, provider)
            console.log("DONE!")
        } catch (error) {
            console.log(error)
        }

        // Listen for the tx to be mined

        console.log(`Funded! `)
    }
}

function listenForTxnMined(transResponse, provider) {
    console.log(` Mining ${transResponse.hash}...`)

    return new Promise((resolve, reject) => {
        provider.once(transResponse.hash, (transactionReceipt) => {
            console.log(
                ` Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })

    //Create listener for the blockchain
}
