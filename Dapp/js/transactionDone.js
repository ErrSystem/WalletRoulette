import {account} from './walletsHandler.js';
import {leverAnim} from './lever.js';
import { RLT } from './RLTSCounter.js';
let alreadyRunning = false;
let alreadyRunned = false;

export default function transactionDone(mode) {
    if (!alreadyRunning && RLT != 0) {
        alreadyRunning = true;
        if (!alreadyRunned) {
            alreadyRunned = true;
            leverAnim(0);
        } else {
            leverAnim(1, mode);
        }
    }
}

export function enableFunction() {
    alreadyRunning = false;
}