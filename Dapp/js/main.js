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

// Add Rlts Button
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

// Buy Rlts with BNB 
const rltBNBbtn = () => {
    const BNB = Array.from(document.querySelectorAll('.PricesBNB button'));
    const CLO = Array.from(document.querySelectorAll('.PricesCLO button'));
    document.querySelector('.selectMethods .BNB').id = 'selectedCurrency';
    document.querySelector('.selectMethods .CLO').id = '';
    CLO.map(element => element.style.opacity = "0");
    BNB.map(element => element.style.display = "block");
    setTimeout(() => {
        document.querySelector('.PricesCLO').style.opacity = "0";
        CLO.map(element => element.style.display = "none");
        BNB.map(element => element.style.opacity = "1");
        setTimeout(() => {
            document.querySelector('.PricesCLO').style.display = "none";
        }, 300);
    }, 300);
}
// Buy Rlts with CLO 
const rltCLObtn = () => {
    document.querySelector('.PricesCLO').style.display = "block";
    const BNB = Array.from(document.querySelectorAll('.PricesBNB button'));
    const CLO = Array.from(document.querySelectorAll('.PricesCLO button'));
    document.querySelector('.selectMethods .CLO').id = 'selectedCurrency';
    document.querySelector('.selectMethods .BNB').id = '';
    BNB.map(element => element.style.opacity = "0");
    CLO.map(element => element.style.display = "block");
    setTimeout(() => {
        document.querySelector('.PricesCLO').style.opacity = "1";
        BNB.map(element => element.style.display = "none");
        CLO.map(element => element.style.opacity = "1");
    }, 300);
}
// click on BNB
document.querySelector('.selectMethods .BNB').addEventListener('click', rltBNBbtn);
// click on CLO
document.querySelector('.selectMethods .CLO').addEventListener('click', rltCLObtn);

// Update BNB and CLO values
const getPrices = () => {
    axios.get('https://api.coingecko.com/api/v3/coins/callisto')
    .then(response => {
        const CLObtns = Array.from(document.querySelectorAll('.PricesCLO button'));
        let ids = CLObtns.map(element => element.className.slice(0, element.className.indexOf("R")));
        ids.forEach(id => {
            console.log(id)
            switch (id) {
                case "five":
                    document.querySelectorAll('.PricesCLO button span')[ids.indexOf(id)].innerHTML = `(${parseInt(1 / response.data.market_data.current_price.usd)} CLO)`;
                break;
                case 'twentyFive':
                    document.querySelectorAll('.PricesCLO button span')[ids.indexOf(id)].innerHTML = `(${parseInt(3 / response.data.market_data.current_price.usd)} CLO)`;
                break;
                case 'fifty':
                    document.querySelectorAll('.PricesCLO button span')[ids.indexOf(id)].innerHTML = `(${parseInt(6 / response.data.market_data.current_price.usd)} CLO)`;
                break;
                case 'hundred':
                    document.querySelectorAll('.PricesCLO button span')[ids.indexOf(id)].innerHTML = `(${parseInt(10 / response.data.market_data.current_price.usd)} CLO)`;
                break;
                case 'twoHundred':
                    document.querySelectorAll('.PricesCLO button span')[ids.indexOf(id)].innerHTML = `(${parseInt(15 / response.data.market_data.current_price.usd)} CLO)`;
                break;
            }
        })
    })
    axios.get('https://api.coingecko.com/api/v3/coins/binancecoin')
    .then(response => {
        const BNBbtns = Array.from(document.querySelectorAll('.PricesBNB button'));
        let ids = BNBbtns.map(element => element.className.slice(0, element.className.indexOf("R")));
        ids.forEach(id => {
            console.log(id)
            switch (id) {
                case "five":
                    document.querySelectorAll('.PricesBNB button span')[ids.indexOf(id)].innerHTML = `(${(1 / response.data.market_data.current_price.usd).toFixed(4)} BNB)`;
                break;
                case 'twentyFive':
                    document.querySelectorAll('.PricesBNB button span')[ids.indexOf(id)].innerHTML = `(${(3 / response.data.market_data.current_price.usd).toFixed(4)} BNB)`;
                break;
                case 'fifty':
                    document.querySelectorAll('.PricesBNB button span')[ids.indexOf(id)].innerHTML = `(${(6 / response.data.market_data.current_price.usd).toFixed(4)} BNB)`;
                break;
                case 'hundred':
                    document.querySelectorAll('.PricesBNB button span')[ids.indexOf(id)].innerHTML = `(${(10 / response.data.market_data.current_price.usd).toFixed(4)} BNB)`;
                break;
                case 'twoHundred':
                    document.querySelectorAll('.PricesBNB button span')[ids.indexOf(id)].innerHTML = `(${(15 / response.data.market_data.current_price.usd).toFixed(4)} BNB)`;
                break;
            }
        })
    })
}
getPrices();
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