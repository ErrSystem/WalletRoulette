let web3;
let errorMsg = document.querySelector('.errorMsg');

const connectWalletHandler = async() => {
    
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            web3 = new Web3(window.ethereum)
        } catch(err) {
            errorMsg.innerText = err.message;
            errorMsg.style.opacity = '1'; 
        }
    } else {
        // meta mask isn't installed 
        errorMsg.innerText = 'Install MetaMask and try again please!';
        errorMsg.style.opacity = '1'; 
    }
}

document.querySelector('.connectWalletButton').addEventListener('click', () => connectWalletHandler());