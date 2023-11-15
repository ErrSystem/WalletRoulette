import {account} from './walletsHandler.js';
import {leverAnim} from './lever.js';
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

export function reduceTickets() {
    tickets--;
}

export function updateTickets () {
    const counter = document.querySelector('.RltsTicketsCounter');
    counter.innerText = tickets;
    if (tickets > 99) {
        counter.style.right = "55px"; 
    }
}