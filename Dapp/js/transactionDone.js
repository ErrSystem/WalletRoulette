import {account} from './walletsHandler.js';
import {leverAnim} from './lever.js';
import { RLT } from './RLTSCounter.js';
import isMobile from './detectSmallScreen.js';
import generatePrivateKey from './generate.js';
import showSpinParameters from './spinParameters.js';
import spin from './spin.js';
let alreadyRunning = false;
let alreadyRunned = false;
let touchStart;
let id;

export default function transactionDone(mode) {
    if (!alreadyRunning && RLT != 0) {
        alreadyRunning = true;
        if (!alreadyRunned) {
            if (!isMobile()) {
                alreadyRunned = true;
                leverAnim(0);
            } else {
                id = 0;
                mobileListener();
            }
        } else {
            if (!isMobile()) {
                leverAnim(1, mode);
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
        showSpinParameters(id);
        window.removeEventListener('touchmove', touchDetector);
    }
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
    });
}