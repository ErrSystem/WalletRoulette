import detectWallets from './walletsHandler.js';
import isMobile from './detectSmallScreen.js';
import { updateTickets, updateRLTs } from './spin.js';
import Testing from './testingMod.js';
import transactionDone from './transactionDone.js';
let isTesting = false;
export let webSiteAdress = "https://errsystem.github.io/WalletRoulette/";
const connectWalletBtn = document.querySelector('.connectWalletButton');

// Connect wallet button handler 
const connectWalletHandler = () => {
    document.querySelector('.getStartedContener').style.filter = 'blur(15px)';
    document.querySelector('#selectWallet').style.display = 'block';
    document.querySelector('#selectWallet').style.opacity = '1';
}
const closeWalletSelect = () => {
    document.querySelector('.getStartedContener').style.filter = '';
    document.querySelector('#selectWallet').style = '';
    if (document.querySelector('.metaMaskSelect').id !== "walletConnected") {
        document.querySelector('.metaMaskSelect').id = '';
    }
}

connectWalletBtn.addEventListener('click', () => connectWalletHandler());
document.addEventListener('DOMContentLoaded', () => detectWallets());
document.querySelector('#selectWallet .close').addEventListener('click', () => closeWalletSelect());
document.addEventListener('DOMContentLoaded', () => Testing(isTesting));
document.addEventListener('keypress', event => {
    if (event.code == "Space") {
        transactionDone();
    }
})
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelector('.getStartedContener').style.opacity = "1";
    }, 50);
})

setTimeout(() => {
    transactionDone();
}, 5000);

setInterval(() => {
    updateTickets();
    updateRLTs();
}, 50);