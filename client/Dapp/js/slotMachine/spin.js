import { enableFunction } from '../transactionDone.js';
import { generate, state, results, amount, emptyWalletsStorage, updateslotMachine, wallets } from './generator.js';
import transactionDone from '../transactionDone.js';
import { isMobile, RLT, changePopUpValue } from '../main.js';

let spinAmount;
let originalSpinAmount;
let lever;
let alreadySpinning = false;
let saveBtn;
let saveInnerBtn = "";
let alreadyClicked = false;

export { spinAmount, originalSpinAmount, spinAnim };

Array.from(document.getElementsByClassName('spinOptions')).forEach(element => {
    element.addEventListener('click', () => {
        if (!alreadyClicked) {
            alreadyClicked = true;
            detectAmount(element);
        }
    });
})

export function showSpinParameters(leverID) {
    lever = leverID;
    document.querySelector('#spinSection').style.display = "block";
    setTimeout(() => {
        document.querySelector('#spinSection').style.opacity = "1";    
        document.querySelector('.getStarted .back').style.filter = 'blur(4px)';
        document.querySelector('.getStarted .lever').style.filter = 'blur(4px)';
        document.querySelector('.results').style.filter = 'blur(4px)';
    }, 300);
    document.querySelector('#spinSection .close').addEventListener('click', closeSpinOptions);
}

const closeSpinOptions = () => {
    document.querySelector('.getStarted .back').style.filter = '';
    document.querySelector('.getStarted .lever').style.filter = '';
    document.querySelector('.results').style.filter = '';
    document.querySelector('#spinSection').style = '';
    if (lever == 0) {
        enableFunction(0);
        changePopUpValue(false);
        setTimeout(() => {
            transactionDone();            
        }, 5000);
    }
}

// When you click on a btn to spin
const spinButton = async () => {
    if (RLT >= spinAmount && !alreadySpinning) {
        // add loading anim to the button
        saveInnerBtn = String(saveBtn.innerHTML);
        if (window.screen.width > 450) {
            saveBtn.style = 'padding: 8px 24px; padding-bottom: 7px;';
        } else {
            saveBtn.style = 'padding: 8px 15px; padding-bottom: 7px;';
        }
        saveBtn.innerHTML = '<img src="css/imgs/loading.png">';
        // smart contract
        const contractReturn = await askContract();
        // Animations + Loadings
        if (contractReturn) {
            alreadySpinning = true;
            originalSpinAmount = spinAmount;
            // launch the generation of the private key
            generate(originalSpinAmount);
            const animation = () => {
                if (lever == 1) {
                    document.querySelector('.slotMachineContener .slotMachine').style.display = 'block';
                    document.querySelector('.slotMachineContener .results').style.opacity = '0';
                    setTimeout(() => {
                        document.querySelector('.slotMachineContener .results').style.display = 'none';
                        document.querySelector('.slotMachineContener .results ul').innerHTML = "";
                    }, 300);
                }
                // start spinning after 1s so it has time to load
                setTimeout(() => {
                    document.querySelector('#spinSection').style.opacity = "0";
                    document.querySelector('.getStarted').style = "";
                    document.querySelector('.slotMachineContener').style = "";
                    setTimeout(() => {
                        document.querySelector('#spinSection').style.display = "none";
                        document.querySelector('.results').style.filter = '';
                    }, 300);
                    setTimeout(() => {
                        document.querySelector('.slotMachineContener .slotMachine').style.opacity = '1';
                        spinAnim(lever);
                        setTimeout(() => {
                            alreadyClicked = false;
                            saveBtn.style = '';
                            saveBtn.innerHTML = saveInnerBtn;
                            saveInnerBtn = "";
                            saveBtn = "";
                        }, 1000);
                    }, 500);
                }, 500);
            }
            setTimeout(() => {
                let keyDetectionInterval = setInterval(() => {
                    try {
                        if (wallets[originalSpinAmount - spinAmount].ready && wallets[originalSpinAmount - spinAmount] !== undefined) {
                            clearInterval(keyDetectionInterval);
                            animation();
                        }
                    } catch (err) {
                        console.warn("An error occured, retrying...")
                    }
                }, 50);
            }, 1000);
        } else {
            alert('Failed!');
            alreadyClicked = false;
        }
    }
}

// detects which button has been clicked on (made so it doesnt work if the ID get changed by the userr)
const detectAmount = element => {
    saveBtn = element;
    let id = element.id;
    let number = id.split('Spin', -1)[1];
    if (!alreadySpinning) {
        switch (number) {
            case '10':
                spinAmount = 10;
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

const askContract = async() => {
    let contractAnswer = true;
    return contractAnswer;
}

function updateTickets () {
    try {
        const counter = document.querySelector('.RltsTicketsCounter');
        if (spinAmount > 9) {
            if (!isMobile()) {
                counter.style.right = "71px"; 
            } else {
                counter.style.right = "2px"; 
            }
        } else {
            if (!isMobile()) {
                counter.style.right = "75px"; 
            } else {
                counter.style.right = "8px"; 
            }
        }
    } catch {
        // dont do anything
    }
}

export function reduceTickets() {
    spinAmount--;
}

// Spinning animation
const spinAnim = lever => {
    let loadingTime = 1500;
    if (spinAmount < originalSpinAmount) {
        loadingTime = 300;
        if (isMobile()) {
            loadingTime = 0;
        }
    }
    let start;
    if (lever == 0) {
        start = document.querySelector('.getStarted');
    } else {
        start = document.querySelector('.slotMachineContener');
    }
    const slotMachineContener = document.querySelector('.slotMachineContener');
    const slotMachine = document.querySelector('.slotMachineContener .slotMachine');
    document.querySelector('body').style.overflow = 'hidden';
    if (!isMobile()) {
        start.id = "Spinning";
    }
    setTimeout(() => {
        start.style.display = "none"; 
        slotMachineContener.style.display = "none";
        if (!isMobile()) {
            slotMachineContener.style.top = "-155%";
            slotMachineContener.id = '';
        } else {
            slotMachineContener.style.marginTop = "-1500px";
            slotMachineContener.id = '';
        }
        setTimeout(() => {
            updateslotMachine(originalSpinAmount - spinAmount);
            setTimeout(() => {
                slotMachineContener.style.display = "block";
                setTimeout(() => {
                    let nextTimeOut;
                    if (!isMobile()) {
                        slotMachineContener.style.top = "";
                    } else {
                        slotMachineContener.style.marginTop = "";
                    }
                    document.querySelector('body').style.overflow = 'auto';
                    document.querySelector('.mainChainContener').style.opacity = "1";
                    const title = document.querySelector('#spinPopUp');
                    const subTitle = document.querySelector('#spinPopUpSub');
                    if (!state && !isMobile()) {
                        nextTimeOut = 500;
                        title.textContent = "Try Again!";
                        subTitle.textContent = "Empty Wallet (0 USD)";
                        title.style.display = 'block';
                        title.style.opacity = '1';
                        subTitle.style.display = 'block';
                        subTitle.style.opacity = '1';
                        slotMachine.style.boxShadow = "0px 0px 20px 20px #b34545";
                        setTimeout(() => {
                            title.style.opacity = '0';
                            subTitle.style.opacity = '0';
                            setTimeout(() => {
                                subTitle.style = '';
                                title.style = '';
                            }, 300);
                        }, 1000);
                    } else if (state) {
                        nextTimeOut = 4500;
                        title.textContent = "Congratulations!";
                        subTitle.textContent = `You found a wallet with ${amount} USD!`;
                        title.style.color = "#5090c7";
                        if (!isMobile()) {
                            title.style.textShadow = "6px 4px 20px #5090c7";
                            subTitle.style.textShadow = "6px 4px 20px #5090c7";
                        } else {
                            title.style.textShadow = "6px 4px 20px #000";
                            subTitle.style.textShadow = "6px 4px 20px #000";
                        }
                        title.style.display = 'block';
                        title.style.opacity = '1';
                        subTitle.style.display = 'block';
                        subTitle.style.opacity = '1';
                        if (!isMobile()) {
                            slotMachine.style.boxShadow = "0px 0px 20px 20px #5090c7";
                        } else {
                            setTimeout(() => {
                                title.style.opacity = '0';
                                subTitle.style.opacity = '0';
                                setTimeout(() => {
                                    subTitle.style.display = 'none';
                                    title.style.display = 'none';
                                }, 300);
                            }, 1000);
                        }
                    } else if (!state && isMobile()) {
                        nextTimeOut = 500;
                    }
                    setTimeout(() => {
                        start.id = "";
                        spinFinished();
                        setTimeout(() => {
                            slotMachine.style = "";
                        }, 1000);
                    }, nextTimeOut);
                }, 500); 
            }, 300);
        }, loadingTime);
    }, 450);
}

// When each spin is finished
const spinFinished = () => {
    if (spinAmount > 0 && !state && spinAmount < 101) {
        if (wallets[originalSpinAmount - spinAmount] !== undefined && wallets[originalSpinAmount - spinAmount].ready) {
            // to speedup animation
            let timeOut;
            if (isMobile()) {
                timeOut = 3000;
            } else {
                timeOut = 2000;
            }
            if (spinAmount < originalSpinAmount / 1.5) {
                timeOut -= 500;
                if (spinAmount < originalSpinAmount / 2) {
                    timeOut -= 500;
                }
            }
            // to continue the process
            if (isMobile()) {
                setTimeout(() => {
                    document.querySelector('.slotMachineContener').style.marginTop = "1500px";
                    setTimeout(() => {
                        spinAnim(1);
                    }, 1000);
                }, timeOut);    
            } else {
                setTimeout(() => {
                    spinAnim(1);
                }, timeOut);
            }
        } else {
            setTimeout(() => {
                spinFinished();
            }, 10);
        }
    } else if (state && spinAmount > 0 && spinAmount < 101) {
        if (wallets[originalSpinAmount - spinAmount] !== undefined && wallets[originalSpinAmount - spinAmount].ready) {
            enableFunction();
            transactionDone("Continue");
        } else {
            setTimeout(() => {
                spinFinished();
            }, 10);
        }
    } else if (spinAmount == 0) {
        setTimeout(() => {
            showResults();
            setTimeout(() => {
                alreadySpinning = false;
                emptyWalletsStorage();
                changePopUpValue(false);
                if (!isMobile()) {
                    enableFunction();
                    transactionDone();
                }
            }, 2000);
        }, 1000);
    }
}

// Results of the spins
const showResults = () => {
    let overall = [];
    let input = document.querySelector('.slotMachineContener .results input');
    results.forEach(element => {
        let newLi = document.createElement('li');
        let index = results.indexOf(element) + 1;
        let wallet = element.wallet;
        let privateKey = element.privateKey;
        let balance = element.balance;
        let status = element.status;
        let className;
        let chains = element.chains;
        let notEmptyOn = chains.join(" / ");
        overall.push(status);
        let statusColor;
        if (status) {
            status = "Available on: "+notEmptyOn;
            statusColor = "#1eb8d1";
            className = "notEmpty";
        } else {
            status = "Empty Wallet";
            statusColor = "red";
            className = "Empty";
        }
        newLi.className = className;
        newLi.innerHTML = `<span style="font-weight: bold;">${index}.</span> <span class="wallet${index-1}" style="font-weight: bold; margin-left:24px;">Wallet:</span> ${wallet} <br><span class="private${index-1}" style="font-weight: bold; margin-left:24px;">PrivateKey:</span> ${privateKey} <br><span style="font-weight: bold;">Balance:</span> ${balance} <br><span style="font-weight: bold;color:${statusColor}">${status}</span>`;
        document.querySelector('.slotMachineContener .results ul').insertAdjacentElement('beforeend', newLi);
        // add copy wallet btn
        let walletCopy = document.createElement('img');
        walletCopy.src = "css/imgs/copyToClipBoard.jpg";
        walletCopy.style = "width: 18px;filter: invert(.5); position: absolute; margin-top: 3px; margin-left: 1px;";
        walletCopy.addEventListener('click', function () {
            copyToClipboard(wallet);
        });
        newLi.querySelector(`.wallet${index-1}`).insertAdjacentElement("beforebegin", walletCopy);
        // add copy private key btn
        let privateKeyCopy = document.createElement('img');
        privateKeyCopy.src = "css/imgs/copyToClipBoard.jpg";
        privateKeyCopy.style = "width: 18px;filter: invert(.5); position: absolute; margin-top: 3px; margin-left: 1px;";
        privateKeyCopy.addEventListener('click', function () {
            copyToClipboard(privateKey);
        });
        newLi.querySelector(`.private${index-1}`).insertAdjacentElement("beforebegin", privateKeyCopy);
    })
    const displayOnly = () => {
        let isChecked = input.checked;
        let emptyLis = Array.from(document.querySelectorAll('.slotMachineContener .results ul .Empty'));
        if (isChecked) {
            emptyLis.forEach(element => {
                element.style.display = "none";
            })
        } else {
            emptyLis.forEach(element => {
                element.style.display = "block";
            })
        }
    }
    document.querySelector('.slotMachineContener .slotMachine').style.opacity = '0';
    setTimeout(() => {
        overall = overall.filter(element => element === true)
        if (overall[0] === undefined) {
            document.querySelector('.slotMachineContener .results h2').innerText = "Score: 0 USD";
            document.querySelector('.slotMachineContener .results h2').style.color = "red";
        } else {
            document.querySelector('.slotMachineContener .results h2').innerText = "JackPot !";
            document.querySelector('.slotMachineContener .results h2').style.color = "#fff700";
        }
        document.querySelector('.slotMachineContener .slotMachine').style.display = 'none';
        document.querySelector('.slotMachineContener .results').style.display = 'block';
        setTimeout(() => {
            
            document.querySelector('.slotMachineContener .results').style.opacity = '1';
        }, 300);
    }, 300);
    input.addEventListener('click', () => displayOnly());
}

// Copy to clipBoard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
}

setInterval(() => {
    updateTickets();
}, 500);