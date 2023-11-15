import {account} from './walletsHandler.js';
import {leverAnim} from './lever.js';
export {tickets};
let alreadyRunning = false;
let alreadyRunned = false;
let tickets = 10;

export default function transactionDone() {
    if (!alreadyRunning && tickets > 0) {
        if (!alreadyRunned) {
            alreadyRunned = true;
            leverAnim(0);
        } else {
            leverAnim(1);
        }
        console.log('Transaction is done!');
        alreadyRunning = true;
    }
}

export function animationDone() {
    setTimeout(() => {
        alreadyRunning = false;
    }, 4000);
}