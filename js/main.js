import connectMetaMask from '/js/detectMetaMask.js'

// Connect wallet button handler 
const connectWalletBtn = document.querySelector('.connectWalletButton');
const connectWalletHandler = () => {
    document.querySelector('.getStarted').style.filter = 'blur(15px)';
    document.querySelector('.selectWallet').style.display = 'block';
    document.querySelector('.selectWallet').style.opacity = '1';
}


connectWalletBtn.addEventListener('click', () => connectWalletHandler());
document.querySelector('.metaMaskSelect').addEventListener('click', () => connectMetaMask());