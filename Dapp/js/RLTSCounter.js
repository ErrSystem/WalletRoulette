let RLT;

const getFromBlockchain = () => {
    // Update this so it gets the number of spins from token smart contract
    RLT = 100;
}

export {RLT};

export function reduceTickets() {
    RLT--;
}

setInterval(() => {
    getFromBlockchain();
}, 10);