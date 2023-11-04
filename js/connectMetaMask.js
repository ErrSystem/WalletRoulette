export default function connectMetaMask() {
    let errorMsg = document.querySelector('.errorMsg');
    const requestMetaMask = async() => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
                showAdress(accounts[0]);
            } catch(err) {
                errorMsg.innerText = err.message;
                errorMsg.style.opacity = '1';
            }
        }
    }
    const showAdress = adress => {
        const adressElement = document.querySelector('.walletAdress');
        let text = [adress.slice(0, 6), adress.slice(adress.length - 4, adress.length)];
        adressElement.innerText = `Connected: ${text[0]}...${text[1]} `;
        adressElement.style.display = 'block'; 
        adressElement.style.opacity = '1'; 
        document.querySelector('.connectWalletButton').style.opacity = '0';
    
    }
    requestMetaMask();
}