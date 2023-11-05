import { setAdress } from './walletsHandler.js';
let alreadyLoading = false;
export default function connectMetaMask() {
    if (!alreadyLoading) {
        let errorMsg = document.querySelector('.errorMsg');
        alreadyLoading = true;
        let current;
        let intervalID;
        const requestMetaMask = async() => {
            if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
                try {
                    document.querySelector('.metaMaskSelect .isInstalled').style.opacity = '0';
                    document.querySelector('.metaMaskSelect .isInstalled').innerText = 'Connecting';
                    current = 0;
                    intervalID = setInterval(connectingAnim, 1000);
                    setTimeout(() => {
                        document.querySelector('.metaMaskSelect').id = "metaMaskSelected";
                        setTimeout(() => {
                            document.querySelector('.metaMaskSelect .isInstalled').style.opacity = '1';
                        }, 300);
                    }, 300);
                    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
                    setAdress(accounts[0], "MetaMask");
                    // removes the interval of Connection...
                    clearInterval(intervalID);
                    // show that it's a success
                    document.querySelector('.metaMaskSelect .isInstalled').innerText = 'Connected!';
                    document.querySelector('.metaMaskSelect .isInstalled').style.color = 'green';
                    current = 'success';
                    vanishLoading();
                    // remove event listener
                    document.querySelector('.metaMaskSelect').removeEventListener('click', connectMetaMask);
                } catch(err) {
                    clearInterval(intervalID);
                    errorMsg.innerText = err.message;
                    errorMsg.style.opacity = '1';
                    // show that an error occured in the loading
                    document.querySelector('.metaMaskSelect .isInstalled').innerText = 'Failed!';
                    document.querySelector('.metaMaskSelect .isInstalled').style.color = 'red';
                    current = 'error';
                    vanishLoading();
                    setTimeout(() => {
                        errorMsg.style.opacity = '0';
                    }, 3500);
                }
            }
        }
        const vanishLoading = () => {
            setTimeout(() => {
                document.querySelector('.metaMaskSelect .isInstalled').style.opacity = '0';
                setTimeout(() => {
                    document.querySelector('.metaMaskSelect .isInstalled').style.color = 'green';
                    if (current === 'error') {
                        document.querySelector('.metaMaskSelect').id = '';
                        document.querySelector('.metaMaskSelect .isInstalled').innerHTML = 'Installed';
                    } else if (current === 'success') {
                        document.querySelector('.metaMaskSelect .isInstalled').innerText = 'Connected';
                        document.querySelector('.metaMaskSelect').id = 'metaMaskConnected';
                    }
                    setTimeout(() => {
                        document.querySelector('.metaMaskSelect .isInstalled').style.opacity = '1';
                        alreadyLoading = false;
                    }, 300);
                }, 300);
            }, 800);
        }
    
        const connectingAnim = () => {
            let text = document.querySelector('.metaMaskSelect .isInstalled').innerText;
            document.querySelector('.metaMaskSelect .isInstalled').innerText = text + '.';
            if (current == 3) {
                document.querySelector('.metaMaskSelect .isInstalled').innerText = 'Connecting.';
                current = 1;
            } else {
                current++;
            }
        }

        requestMetaMask();
    }
}