import connect from './connectMetaMask.js';
export default function detectWallets() {
    const isMetaMask = () => {
        if (window.ethereum !== undefined && ethereum.isMetaMask) {
            document.querySelector('.metaMaskSelect').addEventListener('click', () => connect());
            document.querySelector('.metaMaskSelect .isInstalled').innerText = 'Installed';
        } else {
            redirectToMetaMask();
            document.querySelector('.metaMaskSelect .isInstalled').innerText = 'Not Installed';
            document.querySelector('.metaMaskSelect .isInstalled').style.color = 'red';
        }
    }
    const redirectToMetaMask = () => {
        const link = document.querySelector('.selectWallet a');
        link.href = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
    }
    isMetaMask();
}