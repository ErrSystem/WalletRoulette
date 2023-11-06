import connect from './connectMetaMask.js';
let walletConnectBnt = document.querySelector('.connectWalletButton');
let walletBtnImg = document.querySelector('.connectWalletButton img');
let walletBtnText = document.querySelector('.connectWalletButton a');
export default function detectWallets() {
    const walletListener = () => {
        if (typeof window.ethereum != "undefined" && typeof window != "undefined") {
            window.ethereum.on("accountsChanged", accounts => {
                let walletUsed = undefined;
                if (ethereum.isMetaMask) {
                    walletUsed = "MetaMask";
                }
                setAdress(accounts[0], walletUsed);
            })
        }
    }
    const isMetaMask = async () => {
        if (typeof window.ethereum != "undefined" && ethereum.isMetaMask) {
            // checks if MetaMask is installed
            document.querySelector('.metaMaskSelect').addEventListener('click', connect);
            document.querySelector('.metaMaskSelect .isInstalled').innerText = 'Installed';
            document.querySelector('.metaMaskSelect .isInstalled').style.color = 'green';
            // checks if there was already a connected account in the last session
            try {
                const accounts = await window.ethereum.request({method: "eth_accounts"});
                if (accounts.length > 0) {
                    setAdress(accounts[0], "MetaMask"); 
                    document.querySelector('.metaMaskSelect .isInstalled').innerText = "Connected";
                    document.querySelector('.metaMaskSelect').removeEventListener('click', connect);
                    document.querySelector('.metaMaskSelect').id = 'walletConnected';
                }
            } catch(err) {
                console.log(err.message)
            }
        } else {
            redirectToMetaMask();
            document.querySelector('.metaMaskSelect .isInstalled').innerText = 'Not Installed';
            document.querySelector('.metaMaskSelect .isInstalled').style.color = 'red';
        }
        const redirectToMetaMask = () => {
            const link = document.querySelector('.selectWallet a');
            link.href = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
        }
    }
    
    walletListener();
    isMetaMask();
}

export function setAdress(adress, wallet) {
    if (typeof adress != "undefined") {
        let text = [adress.slice(0, 6), adress.slice(adress.length - 4, adress.length)];
        walletBtnText.innerText = `Connected: ${text[0]}...${text[1]} `;
        walletBtnImg.src = `css/imgs/${wallet}.png`;
        walletConnectBnt.id = "connectedWalletBtn";
    } else {
        walletBtnText.innerText = "Connect Wallet";
        walletConnectBnt.id = "";
        if (wallet == 'MetaMask') {
            document.querySelector('.metaMaskSelect').id = '';
            document.querySelector('.metaMaskSelect .isInstalled').innerText = 'Installed';
            document.querySelector('.metaMaskSelect').addEventListener('click', connect);
        }
    }
}

export function successWalletConnect(wallet) {
    const numParticles = 150;
    const walletSelect = document.querySelector(`.${wallet}Select`);
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.className = "walletSuccessParticle";
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
                particleAnimationHandler(particle, 'bottom', i);
            }
        } else {
            for (let i = 56; i > randomBottom+1; i--) {
                particleAnimationHandler(particle, 'bottom', i);
            }
        }
        if (randomRight > 69) {
            for (let i = 69; i < randomRight+1; i++) {
                particleAnimationHandler(particle, 'right', i);
            }
        } else {
            for (let i = 69; i > randomRight+1; i--) {
                particleAnimationHandler(particle, 'right', i);
            }
        }
        setTimeout(() => {
            particle.remove();
        }, 1200);
    })
    document.querySelector(`.${wallet}Select .isInstalled`).innerText = 'Connected!';
    document.querySelector(`.${wallet}Select .isInstalled`).style.color = 'green';
    document.querySelector(`.${wallet}Select`).id = "walletSuccess";
}

const particleAnimationHandler = (particle, where, num) => {
    setTimeout(() => {
        if(where == 'bottom'){
            particle.style.bottom = num+'%';
        } else if (where == 'right') {
            particle.style.right = num+'%';
        }
    }, 50);
}