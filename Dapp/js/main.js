import detectWallets from './walletsHandler.js';
import isMobile from './detectSmallScreen.js';
import { switchNetworks } from './walletsHandler.js';
import { updateRLTs, updateTickets } from './spin.js';
import Testing from './testingMod.js';
import transactionDone from './transactionDone.js';
let isTesting = false;
let isAddRLTButton = false;
export let webSiteAdress = "https://errsystem.github.io/WalletRoulette/";

// Connect wallet button handler 
const connectWalletBtn = document.querySelector('.connectWalletButton');
export function connectWalletHandler() {
    setTimeout(() => {
        if (!isAddRLTButton) {
            document.querySelector('.getStartedContener').style.filter = 'blur(15px)';
            document.querySelector('#selectWallet').style.display = 'block';
            try {
                document.querySelector('#networkImcompatible').addEventListener('click', () => {
                    document.querySelector('#selectWallet .connectNetworks').style.display = 'block';
                    document.querySelector('#selectWallet .connectWallets').style.opacity = '0';
                    setTimeout(() => {
                        document.querySelector('#selectWallet .connectNetworks').style.opacity = '1';
                        document.querySelector('#selectWallet .connectWallets').style.display = 'none';
                    }, 300);
                })
            } catch {
                // do nothing since this func is only used to check the state of the metaMask button and add the listener :))
            }
            setTimeout(() => {
                document.querySelector('#selectWallet').style.opacity = '1';        
            }, 300);
        }
    }, 10);
}
export function closeWalletSelect() {
    document.querySelector('.getStartedContener').style.filter = '';
    document.querySelector('#selectWallet').style = '';
    if (document.querySelector('.metaMaskSelect').id !== "walletConnected" && document.querySelector('.metaMaskSelect').id !== "networkImcompatible") {
        document.querySelector('.metaMaskSelect').id = '';
    }
    // Make the networks non-visibles
    document.querySelector('#selectWallet h4').innerHTML = "Supported Wallets:";
    document.querySelector('#selectWallet  .connectNetworks').style.opacity = "0";
    document.querySelector('#selectWallet  .connectNetworks').style.display = "none";
    document.querySelector('#selectWallet .connectWallets').style.opacity = '1';
    document.querySelector('#selectWallet .connectWallets').style.display = 'block';
}
// Connect Wallet Button Click
connectWalletBtn.addEventListener('click', () => connectWalletHandler());
// Detect wallets logged from last time
document.addEventListener('DOMContentLoaded', () => detectWallets());
// Close Wallet select button
document.querySelector('#selectWallet .close').addEventListener('click', () => closeWalletSelect());

// Buy Rlts Button
const buyRLTSection = document.querySelector('#paymentSection');
const openRLTPayments = () => {
    isAddRLTButton = true;
    buyRLTSection.style.display = 'block';
    setTimeout(() => {
        document.querySelector('.getStartedContener').style.filter = 'blur(15px)';
        buyRLTSection.style.opacity = '1';
        isAddRLTButton = false;
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
document.querySelector('.getStarted .connectWalletButton .addBtn').addEventListener('click', openRLTPayments);
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
// Used for testing purpose only will be removed in the future
setTimeout(() => {
    transactionDone();
}, 1000);
// Update Chain ID
window.ethereum.on('chainChanged', switchNetworks);
// Update values
setInterval(() => {
    updateRLTs();
    updateTickets();
}, 50);