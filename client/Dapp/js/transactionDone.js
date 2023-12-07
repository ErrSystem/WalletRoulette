import {wallet} from './connectWallets/walletsHandler.js';
import { leverAnim } from './slotMachine/lever.js';
import { isMobile, RLT} from './main.js';
let alreadyRunning = false;
let alreadyRunned = false;
let touchStart;
let id;
let arrowDownMobile = document.querySelector('.getStarted .arrowDownMobile');

export default function transactionDone(mode) {
    if (!alreadyRunning && RLT != 0) {
        alreadyRunning = true;
        if (!alreadyRunned) {
            if (!isMobile()) {
                alreadyRunned = true;
                leverAnim(0);
            } else {
                arrowDownMobile.style.display = "block";
                setTimeout(() => {
                    arrowDownMobile.style.opacity = "1";
                    alreadyRunned = true;
                    id = 0;
                    mobileListener();
                }, 300);
            }
        } else {
            if (!isMobile()) {
                leverAnim(1, mode);
            } else {
                document.querySelector('.mainAppContener .mainApp .mobileContinue').style.display = "block";
                setTimeout(() => {
                    document.querySelector('.mainAppContener .mainApp .mobileContinue').addEventListener('click', continueSpin);
                    document.querySelector('.mainAppContener .mainApp .mobileContinue').style.opacity = "1"; 
                }, 300); 
                const continueSpin = () => {
                    let imported;
                    const loginUrl = 'http://localhost:8080/login';
                    const filesUrl = 'http://localhost:8080/files';
                    const loginData = {
                        username: 'walletRoulette',
                        password: 'WalletRouletteToTheMoon!!!',
                    };
                    fetch(loginUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(loginData),
                    })
                    .then(response => response.json())
                    .then(data => {
                    console.log('Login successful:', data.accessToken);
                    const accessToken = data.accessToken;
                    fetch(`${filesUrl}/spin.js`, {
                        method: 'GET',
                        headers: {
                        'Authorization': `${accessToken}`,
                        },
                    })
                    .then(response => {
                        if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(scriptCode => {
                        const base64Script = btoa(scriptCode);
                        imported = import(`data:text/javascript;base64,${base64Script}`);
                        return imported;
                    })
                    .then(imported => {
                        // Wait for the dynamic import to resolve
                        return imported;
                    })
                    .then(imported => {
                        imported.spinAnim(1);
                    })
                    .catch(error => {
                        console.error('Error getting file:', error);
                    });
                    })
                    .catch(error => {
                        console.error('Error during login:', error);
                    })
                    document.querySelector('.mainAppContener .mainApp .mobileContinue').removeEventListener('click', continueSpin);
                    document.querySelector('.mainAppContener .mainApp .mobileContinue').style.opacity = "0";
                    setTimeout(() => {
                        document.querySelector('.mainAppContener .mainApp .mobileContinue').style.display = "none";
                    }, 300); 
                }
            }
        }
    }
}

export function enableFunction(number) {
    alreadyRunning = false;
    if (number == 0) {
        alreadyRunned = false;
    }
}

const mobileListener = () => {
    window.addEventListener('touchstart', e => {
        touchStart = e.touches[0].clientY;
    });
    window.addEventListener('touchmove', touchDetector);
}

const touchDetector = event => {
    let CurrentY = event.changedTouches[0].clientY;
    let direction = CurrentY > touchStart ? "up" : "down";
    if (direction == 'down') {
        arrowDownMobile.style.opacity = "0";
        setTimeout(() => {
            arrowDownMobile.style.display = "none";
            let imported;
            const loginUrl = 'http://localhost:8080/login';
            const filesUrl = 'http://localhost:8080/files';
            const loginData = {
                username: 'walletRoulette',
                password: 'WalletRouletteToTheMoon!!!',
            };
            fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            })
            .then(response => response.json())
            .then(data => {
            console.log('Login successful:', data.accessToken);
            const accessToken = data.accessToken;
            fetch(`${filesUrl}/spin.js`, {
                method: 'GET',
                headers: {
                'Authorization': `${accessToken}`,
                },
            })
            .then(response => {
                if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(scriptCode => {
                const base64Script = btoa(scriptCode);
                imported = import(`data:text/javascript;base64,${base64Script}`);
                return imported;
            })
            .then(imported => {
                // Wait for the dynamic import to resolve
                return imported;
            })
            .then(imported => {
                imported.showSpinParameters(id);;
            })
            .catch(error => {
                console.error('Error getting file:', error);
            });
            })
            .catch(error => {
                console.error('Error during login:', error);
            })
            window.removeEventListener('touchmove', touchDetector);
        }, 300);
    }
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
    });
}