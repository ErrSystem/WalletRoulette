import {wallet} from './connectWallets/walletsHandler.js';
import { leverAnim } from './slotMachine/lever.js';
import { isMobile, RLT } from './main.js';
import { showSpinParameters } from './slotMachine/spin.js';
let alreadyRunning = false;
let alreadyRunned = false;
let touchStart;
let id;
let arrowDownMobile = document.querySelector('.arrowDownMobile');

export default function transactionDone(mode) {
    if (!alreadyRunning && RLT != 0) {
        alreadyRunning = true;
        if (!alreadyRunned) {
            if (!isMobile()) {
                alreadyRunned = true;
                leverAnim(0);
            } else {
                document.querySelector('.getStarted .back').style.filter = "brightness(0.3)";
                document.querySelector('.getStarted .back').style.overflow = "hidden";
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
                document.querySelector('.slotMachineContener .slotMachine .mobileContinue').style.display = "block";
                setTimeout(() => {
                    document.querySelector('.slotMachineContener .slotMachine .mobileContinue').addEventListener('click', continueSpin);
                    document.querySelector('.slotMachineContener .slotMachine .mobileContinue').style.opacity = "1"; 
                }, 300); 
                const continueSpin = () => {
                    document.querySelector('.slotMachineContener .slotMachine .mobileContinue').removeEventListener('click', continueSpin);
                    document.querySelector('.slotMachineContener .slotMachine .mobileContinue').style.opacity = "0";
                    setTimeout(() => {
                        document.querySelector('.slotMachineContener .slotMachine .mobileContinue').style.display = "none";
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
        document.querySelector('.getStarted .back').style.filter = "";
        document.querySelector('.getStarted .back').style.overflow = "";
        setTimeout(() => {
            arrowDownMobile.style.display = "none";
            showSpinParameters(id);
            window.removeEventListener('touchmove', touchDetector);
        }, 300);
    }
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
    });
}