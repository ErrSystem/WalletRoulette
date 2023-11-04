let web3

const connectWalletHandler = async() => {
    
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            web3 = new Web3(window.ethereum)
        } catch(err) {
            alert(err.message)
        }
    } else {
        // meta mask isn't installed 
        alert('Install MetaMask and try again please!');
    }
}

document.querySelector('.connectWalletButton').addEventListener('click', () => connectWalletHandler());