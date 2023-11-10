import {account} from './walletsHandler.js';
import {leverAnim} from './lever.js';
let alreadyRunning = false;

export default function transactionDone() {
    if (!alreadyRunning) {
        alreadyRunning = true;
        console.log('Transaction is done!');
        const getStarted = document.querySelector('.getStarted');
        getStarted.id = "getStartedTransationDone";
        leverAnim();
        setTimeout(() => {
            mouseDownAnim();
        }, 1000);
    }
}

const mouseDownAnim = () => {
    const mouseDown = document.querySelector('.getStarted .mouseDown');
    mouseDown.style.display = 'block';
    setTimeout(() => {
        mouseDown.style.opacity = '1';
    }, 2000);
}

export function animationDone() {
    setTimeout(() => {
        alreadyRunning = false;
    }, 4000);
}