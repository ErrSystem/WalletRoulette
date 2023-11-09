import {account} from './walletsHandler.js'

export default function transactionDone() {
    const getStarted = document.querySelector('.getStarted');
    const connectButton = document.querySelector('.connectWalletButton');
    const hoverConnectButton = document.querySelector('.connectWalletButton .hover');
    getStarted.id = "getStartedTransationDone";
    connectButton.addEventListener('mouseover', () => {
        hoverConnectButton.innerText = account
    })
}