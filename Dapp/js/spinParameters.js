import spin from './spin.js';
import generatePrivateKey from './generate.js';
import { RLT } from './RLTSCounter.js';
import { enableFunction } from './transactionDone.js';
import { state } from './generate.js';
import transactionDone from './transactionDone.js';
import { wallets } from './generate.js';
import { emptyWalletsStorage } from "./generate.js";
import generatePrivateKeyNew from './newGenerate.js';
import isMobile from './detectSmallScreen.js';

let spinAmount;
let originalSpinAmount;
let lever;
let alreadySpinning = false;

export { spinAmount, originalSpinAmount };

Array.from(document.getElementsByClassName('spinOptions')).forEach(element => {
    element.addEventListener('click', () => detectAmount(element.id));
})

export default function showSection(leverID) {
    lever = leverID;
    document.querySelector('#spinSection').style.display = "block";
    setTimeout(() => {
        document.querySelector('#spinSection').style.opacity = "1";    
        document.querySelector('.getStartedContener').style.filter = "blur(15px)";
        document.querySelector('.mainAppContener').style.filter = "blur(15px)";
    }, 300);
    document.querySelector('#spinSection .close').addEventListener('click', closeSpinOptions);
}

const closeSpinOptions = () => {
    document.querySelector('.getStartedContener').style.filter = '';
    document.querySelector('.mainAppContener').style.filter = "";
    document.querySelector('#spinSection').style = '';
    if (lever == 0) {
        enableFunction(0);
        transactionDone();
    }
}

const spinButton = async () => {
    if (RLT >= spinAmount && !alreadySpinning) {
        const contractReturn = await askContract();
        if (contractReturn) {
            alreadySpinning = true;
            originalSpinAmount = spinAmount;
            // launch the generation of the private key
            generatePrivateKeyNew(originalSpinAmount);
            if (lever == 1) {
                document.querySelector('.mainAppContener .mainApp').style.display = 'block';
                document.querySelector('.mainAppContener .results').style.opacity = '0';
                setTimeout(() => {
                    document.querySelector('.mainAppContener .results').style.display = 'none';
                    document.querySelector('.mainAppContener .results ul').innerHTML = "";
                }, 300);
            }
            // start spinning after 1s so it has time to load
            setTimeout(() => {
                document.querySelector('#spinSection').style.opacity = "0";
                document.querySelector('.getStartedContener').style = "";
                document.querySelector('.mainAppContener').style = "";
                setTimeout(() => {
                    document.querySelector('#spinSection').style.display = "none";
                }, 300);
                setTimeout(() => {
                    document.querySelector('.mainAppContener .mainApp').style.opacity = '1';
                    spin(lever);
                }, 500);
            }, 2500);
        } else {
            alert('Failed!');
        }
    }
}

const askContract = async() => {
    let contractAnswer = true;
    return contractAnswer;
}

const detectAmount = id => {
    let number = id.split('Spin', -1)[1];
    if (!alreadySpinning) {
        switch (number) {
            case '10':
                spinAmount = 1;
                spinButton()
            break;
            case '20':
                spinAmount = 20;
                spinButton();
            break;
            case '50':
                spinAmount = 50;
                spinButton();
            break;
            case '100':
                spinAmount = 100;
                spinButton();
            break;
        }
    }
}

const showResults = () => {
    let overall = [];
    console.log(wallets)
    wallets.forEach(element => {
        let newLi = document.createElement('li');
        let index = wallets.indexOf(element) + 1;
        let wallet = element.wallet;
        let privateKey = element.privateKey;
        let balance = element.balance;
        let status = element.status;
        overall.push(status);
        let statusColor;
        if (element.status) {
            statusColor = "#1eb8d1";
        } else {
            statusColor = "red";
        }
        newLi.innerHTML = `<span style="font-weight: bold;">${index}. Wallet:</span> ${wallet} <br><span style="font-weight: bold;">PrivateKey:</span> ${privateKey} <br><span style="font-weight: bold;">Balance:</span> ${balance} <br><span style="font-weight: bold;color:${statusColor}">Status: ${status}</span>`;
        console.log(newLi.innerHTML);
        document.querySelector('.mainAppContener .results ul').insertAdjacentElement('beforeend', newLi);
    })
    document.querySelector('.mainAppContener .mainApp').style.opacity = '0';
    setTimeout(() => {
        overall = overall.filter(element => element === true)
        if (overall[0] === undefined) {
            document.querySelector('.mainAppContener .results h2').innerText = "Score: 0 USD";
            document.querySelector('.mainAppContener .results h2').style.color = "red";
        } else {
            document.querySelector('.mainAppContener .results h2').innerText = "JackPot !";
            document.querySelector('.mainAppContener .results h2').style.color = "#fff700";
        }
        document.querySelector('.mainAppContener .mainApp').style.display = 'none';
        document.querySelector('.mainAppContener .results').style.display = 'block';
        setTimeout(() => {
            
            document.querySelector('.mainAppContener .results').style.opacity = '1';
        }, 300);
    }, 300);
}

export function updateTickets () {
    const counter = document.querySelector('.RltsTicketsCounter');
    counter.innerText = spinAmount;
    if (spinAmount > 9) {
        if (!isMobile()) {
            counter.style.right = "55px"; 
        } else {
            counter.style.right = "8px"; 
        }
    }
}

export function updateRLTs() {
    const counter = document.querySelector('.RltsCoinsCounter');
    counter.innerText = RLT;
    if (RLT > 99 && RLT < 999) {
        counter.style.right =  "2px";
    } else if (RLT > 999) {
        counter.style.right = "-7px";
    }
}

export function reduceTickets() {
    spinAmount--;
}

export function spinFinished() {
    if (spinAmount > 0 && !state) {
        if (isMobile()) {
            setTimeout(() => {
                document.querySelector('.mainAppContener').style.marginTop = "1500px";
                // generatePrivateKey();
                setTimeout(() => {
                    spin(1);
                }, 1000);
            }, 2600);    
        } else {
            setTimeout(() => {
                // generatePrivateKey();
                setTimeout(() => {
                    spin(1);
                }, 1000);        
            }, 3000);
        }
    } else if (state && spinAmount > 0) {
        enableFunction();
        transactionDone("Continue");
    } else {
        showResults();
        setTimeout(() => {
            alreadySpinning = false;
            emptyWalletsStorage();
            if (!isMobile()) {
                enableFunction();
                transactionDone();
            }
        }, 1000);
    }
}

setInterval(() => {
    updateRLTs();
}, 500);