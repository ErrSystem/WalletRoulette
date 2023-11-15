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
    }
}

export function animationDone() {
    setTimeout(() => {
        alreadyRunning = false;
    }, 4000);
}