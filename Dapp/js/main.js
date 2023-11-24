import detectWallets from './walletsHandler.js';
import isMobile from './detectSmallScreen.js';
import { updateTickets, updateRLTs } from './spin.js';
import Testing from './testingMod.js';
import transactionDone from './transactionDone.js';
let isTesting = false;
export let webSiteAdress = "https://errsystem.github.io/WalletRoulette/";

// Connect wallet button handler 
const connectWalletBtn = document.querySelector('.connectWalletButton');
const connectWalletHandler = () => {
    document.querySelector('.getStartedContener').style.filter = 'blur(15px)';
    document.querySelector('#selectWallet').style.display = 'block';
    setTimeout(() => {
        document.querySelector('#selectWallet').style.opacity = '1';        
    }, 300);
}
const closeWalletSelect = () => {
    document.querySelector('.getStartedContener').style.filter = '';
    document.querySelector('#selectWallet').style = '';
    if (document.querySelector('.metaMaskSelect').id !== "walletConnected") {
        document.querySelector('.metaMaskSelect').id = '';
    }
}
// Connect Wallet Button Click
connectWalletBtn.addEventListener('click', () => connectWalletHandler());
// Detect wallets logged from last time
document.addEventListener('DOMContentLoaded', () => detectWallets());
// Close Wallet select button
document.querySelector('#selectWallet .close').addEventListener('click', () => closeWalletSelect());

// Buy Rlts Button
const buyRLTBtn = document.querySelector('.buyBtn');
const buyRLTSection = document.querySelector('#paymentSection');
const openRLTPayments = () => {
    buyRLTSection.style.display = 'block';
    setTimeout(() => {
        document.querySelector('.getStartedContener').style.filter = 'blur(15px)';
        buyRLTSection.style.opacity = '1';
    }, 300);
}
const closeRLTPayments = () => {
    document.querySelector('.getStartedContener').style.filter = '';
    buyRLTSection.style.opacity = '0';
    setTimeout(() => {
        buyRLTSection.style.display = 'none';
    }, 300);
}
// Open payment section
buyRLTBtn.addEventListener('click', openRLTPayments);
// Close payment section
document.querySelector('#paymentSection .close').addEventListener('click', closeRLTPayments);
// Check if test mode
document.addEventListener('DOMContentLoaded', () => Testing(isTesting));
// WebSite Appears
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelector('.getStartedContener').style.opacity = "1";
    }, 50);
})
setTimeout(() => {
    transactionDone();
}, 1000);

setInterval(() => {
    updateTickets();
    updateRLTs();
}, 50);