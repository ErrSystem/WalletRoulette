import connect from './connectMetaMask.js';
import isMobile from './detectSmallScreen.js';
import { connectWalletHandler } from './main.js';
let walletConnectBnt = document.querySelector('.connectWalletButton');
let walletBtnImg = document.querySelector('.connectWalletButton img');
let walletBtnText = document.querySelector('.connectWalletButton a');
export let account;
let alreadyExecuted = false; // used to update chain (the func wont execute two times only if you connect to the good network and change the chain again)
let chainId;
let clickedBnt; 
export default function detectWallets() {
    const walletListener = () => {
        if (typeof window.ethereum != "undefined" && typeof window != "undefined") {
            window.ethereum.on("accountsChanged", accounts => {
                let walletUsed = undefined;
                if (ethereum.isMetaMask) {
                    walletUsed = "MetaMask";
                }
                account = accounts[0];
                setAdress(accounts[0], walletUsed);
            })
        }
    }
    const isMetaMask = async () => {
        const redirectToMetaMask = () => {
            const link = document.querySelector('#selectWallet a');
            link.href = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
        }
        if (typeof window.ethereum != "undefined" && ethereum.isMetaMask) {
            // checks if MetaMask is installed
            document.querySelector('.metaMaskSelect').addEventListener('click', connect);
            document.querySelector('.metaMaskSelect .isInstalled').innerText = 'Installed';
            document.querySelector('.metaMaskSelect .isInstalled').style.color = '#47b747';
            // checks if there was already a connected account in the last session
            try {
                const accounts = await window.ethereum.request({method: "eth_accounts"});
                if (accounts.length > 0) {
                    account = accounts[0];
                    setAdress(accounts[0], "MetaMask"); 
                    document.querySelector('.metaMaskSelect .isInstalled').innerText = "Connected";
                    document.querySelector('.metaMaskSelect').removeEventListener('click', connect);
                    document.querySelector('.metaMaskSelect').id = 'walletConnected';
                }
            } catch(err) {
                // nothing here
            }
        } else {
            redirectToMetaMask();
            document.querySelector('.metaMaskSelect .isInstalled').innerText = 'Not Installed';
            document.querySelector('.metaMaskSelect .isInstalled').style.color = 'red';
        }
    }
    walletListener();
    isMetaMask();
}

// functions to switch network
const switchCallisto = async () => {
    // try to switch network
    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x334' }],
        });
    } catch {
        // ask the user if he wants to install it
        try {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainName: 'Callisto Network',
                    chainId: "0x334",
                    nativeCurrency: { name: 'CLO', decimals: 18, symbol: 'CLO' },
                    rpcUrls: ['https://rpc.callisto.network']
                  }
                ]
            });
        } catch (error) {
            // error msg
            document.querySelector('#selectWallet .errorMsg').innerHTML = error.message;
            document.querySelector('#selectWallet .errorMsg').style.opacity = "1";
            setTimeout(() => {
                document.querySelector('#selectWallet .errorMsg').style.opacity = "0";
            }, 1500);
        }
    }
}
const switchBNB = async () => {
    // try to switch the network
    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x38' }],
        });
    } catch {
        // asks the user if he wants to install it
        try {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainName: 'BNB Smart Chain',
                    chainId: "0x38",
                    nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
                    rpcUrls: ['https://bsc-dataseed.binance.org']
                  }
                ]
            });
        } catch (error) {
            // error msg
            document.querySelector('#selectWallet .errorMsg').innerHTML = error.message;
            document.querySelector('#selectWallet .errorMsg').style.opacity = "1";
            setTimeout(() => {
                document.querySelector('#selectWallet .errorMsg').style.opacity = "0";
            }, 1500);
        }
    }
}

// Used to show to the user that he has to change the network
const showChangeNetwork = () => {    
    document.querySelector('.connectNetworks .network').addEventListener('click', switchBNB)
    document.querySelector('.connectNetworks .network2').addEventListener('click', switchCallisto);
    document.querySelector('#selectWallet h4').innerHTML = "Supported Networks:";
    document.querySelector('#selectWallet h4').style = "right: -18px; padding-left: 11px;";
    document.querySelector('#selectWallet .connectWallets').style.opacity = "0";
    document.querySelector('.connectNetworks').style.display = 'block';
    setTimeout(() => {
        document.querySelector('#selectWallet .connectWallets').style.display = "none";
        document.querySelector('.connectNetworks').style.opacity = '1';
    }, 300);
}
export function updateChainValue() {
    // To remove all change network elements
    const revertToInitialState = () => {
        document.querySelector('.connectWalletButton .usedNetwork').src = `https://s2.coinmarketcap.com/static/img/coins/64x64/${chainId}.png`;
        document.querySelector('#networkImcompatible').removeEventListener('click', showChangeNetwork);
        document.querySelector('#networkImcompatible').id = 'walletConnected';
        document.querySelector('#selectWallet h4').innerHTML = "Supported Wallets:";
        document.querySelector('#selectWallet h4').style = "";
        document.querySelector('#walletConnected .isInstalled').innerText = 'Connected!';
        document.querySelector('.connectNetworks').style.opacity = '0';
        document.querySelector('.connectWallets').style.display = 'block';
        document.querySelector('.connectNetworks .network').removeEventListener('click', switchBNB);
        document.querySelector('.connectNetworks .network2').removeEventListener('click', switchCallisto);
        alreadyExecuted = false;
        setTimeout(() => {
            document.querySelector('.connectWallets').style.opacity = '1';
            document.querySelector('.connectNetworks').style.display = 'none';
        }, 300);
    }
    setTimeout(async () => {
        chainId = await window.ethereum.request({ method: 'eth_chainId' });
        // checks if its supported
        switch (chainId) {
            // will use link of their imgs for the ID
            case "0x334":
                chainId = "2757";
            break;
            case "0x38":
                chainId = "1839";
            break;
            default:
                chainId = undefined;
            break;
        }
        console.log(chainId)
        // if its not show it 
        if (chainId == undefined && !alreadyExecuted) {
            alreadyExecuted = true;
            // shows to the user that its imcompatible using a PopUp
            document.querySelector('.connectWalletButton .usedNetwork').src = `css/imgs/questionMark.png`;
            document.querySelector('#walletConnected').addEventListener('click', showChangeNetwork);
            document.querySelector('#walletConnected .isInstalled').innerText = 'Imcompatible Network!';
            document.querySelector('#walletConnected').id = "networkImcompatible";
            setTimeout(() => {
                connectWalletHandler();
            }, 300);
        } else if(alreadyExecuted && chainId !== undefined) {
            revertToInitialState();
        } else {
            document.querySelector('.connectWalletButton .usedNetwork').src = `https://s2.coinmarketcap.com/static/img/coins/64x64/${chainId}.png`;
        }
    }, 2500);
}

export function setAdress(adress, wallet) {
    if (typeof adress != "undefined") {
        let text = [adress.slice(0, 6), adress.slice(adress.length - 4, adress.length)];
        walletBtnText.innerText = `${text[0]}...${text[1]} `;
        walletBtnImg.src = `css/imgs/${wallet}.png`;
        walletConnectBnt.id = "connectedWalletBtn";
        updateChainValue();
    } else {
        walletBtnText.innerText = "Connect Wallet";
        walletConnectBnt.id = "";
        document.querySelector('.connectWalletButton .usedNetwork').src = `css/imgs/questionMark.png`;
        if (wallet == 'MetaMask') {
            document.querySelector('.metaMaskSelect').id = '';
            document.querySelector('.metaMaskSelect .isInstalled').innerText = 'Installed';
            document.querySelector('.metaMaskSelect .isInstalled').color = "#47b747";
            document.querySelector('.metaMaskSelect').addEventListener('click', connect);
        }
    }
}

export function successWalletConnect(wallet) {
    particleAnimation(wallet);
    document.querySelector(`.${wallet}Select .isInstalled`).innerText = 'Connected!';
    document.querySelector(`.${wallet}Select .isInstalled`).style.color = 'green';
    document.querySelector(`.${wallet}Select`).id = "walletSuccess";
}

const particleAnimation = wallet => {
    const particleAnimationHelper = (particle, where, num) => {
        setTimeout(() => {
            if(where == 'bottom'){
                particle.style.bottom = num+'%';
            } else if (where == 'right') {
                particle.style.right = num+'%';
            }
        }, 1);
    }
    const numParticles = 200;
    const walletSelect = document.querySelector(`.${wallet}Select`);
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = "walletSuccessParticle";
        particle.style.transition = "ease all 0.3s"
        walletSelect.insertAdjacentElement("afterbegin", particle);
    }
    document.querySelectorAll('.walletSuccessParticle').forEach(particle => {
        let randomRight = Math.random() * 150 - 50;
        let randomBottom = Math.random() * 300 - 150;
        particle.style.right = '69%';
        particle.style.bottom = '60%';
        particle.style.transition = 'all ease 1s';
        if (randomBottom > 56) {
            for (let i = 56; i < randomBottom+1; i++) {
                particleAnimationHelper(particle, 'bottom', i);
            }
        } else {
            for (let i = 56; i > randomBottom+1; i--) {
                particleAnimationHelper(particle, 'bottom', i);
            }
        }
        if (randomRight > 69) {
            for (let i = 69; i < randomRight+1; i++) {
                particleAnimationHelper(particle, 'right', i);
            }
        } else {
            for (let i = 69; i > randomRight+1; i--) {
                particleAnimationHelper(particle, 'right', i);
            }
        }
        setTimeout(() => {
            particle.style.opacity = '0';
            setTimeout(() => {
                particle.remove();
            }, 300);
        }, 1200);
    })
}