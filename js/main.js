import detectWallets from './walletsHandler.js';
import isMobile from './detectSmallScreen.js';

// Connect wallet button handler 
const connectWalletBtn = document.querySelector('.connectWalletButton');
const connectWalletHandler = () => {
    document.querySelector('.getStarted').style.filter = 'blur(15px)';
    if (!isMobile()) {
        document.querySelector('#particles-js').style.filter = 'blur(15px)';
    }
    document.querySelector('.selectWallet').style.display = 'block';
    document.querySelector('.selectWallet').style.opacity = '1';
}
const closeWalletSelect = () => {
    document.querySelector('#particles-js').style = "";
    document.querySelector('.getStarted').style = '';
    document.querySelector('.selectWallet').style = '';
    if (document.querySelector('.metaMaskSelect').id !== "walletConnected") {
        document.querySelector('.metaMaskSelect').id = '';
    }
}

connectWalletBtn.addEventListener('click', () => connectWalletHandler());
document.addEventListener('DOMContentLoaded', () => detectWallets());
document.querySelector('.closeSelectWallet').addEventListener('click', () => closeWalletSelect());