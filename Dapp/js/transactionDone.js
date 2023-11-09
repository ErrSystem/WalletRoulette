import {account} from './walletsHandler.js';
import {leverAnim} from './lever.js';

export default function transactionDone() {
    console.log('Transaction is done!')
    const getStarted = document.querySelector('.getStarted');
    getStarted.id = "getStartedTransationDone";
    leverAnim();
}