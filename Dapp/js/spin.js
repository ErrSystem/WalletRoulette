import { state, amount } from "./generate.js";
import { spinFinished } from "./spinParameters.js";
export default function spin(lever) {
    let start;
    console.log(lever)
    if (lever == 0) {
        start = document.querySelector('.getStartedContener');
    } else {
        start = document.querySelector('.mainAppContener');
    }
    const mainAppContener = document.querySelector('.mainAppContener');
    const mainApp = document.querySelector('.mainAppContener .mainApp');
    document.querySelector('body').style.overflow = 'hidden';
    start.id = "Spinning";
    setTimeout(() => {
        start.style.display = "none"; 
        mainAppContener.style.display = "none";
        mainAppContener.style.top = "-155%";
            setTimeout(() => {
                mainAppContener.style.display = "block";
                setTimeout(() => {
                    mainAppContener.style.top = "";
                    mainAppContener.id = '';
                    document.querySelector('body').style.overflow = 'auto';
                    document.querySelector('.mainChainContener').style.opacity = "1";
                    const title = document.querySelector('#spinPopUp');
                    const subTitle = document.querySelector('#spinPopUpSub');
                    if (!state) {
                        title.textContent = "Try Again!";
                        subTitle.textContent = "Empty Wallet (0 USD)";
                        title.style.display = 'block';
                        title.style.opacity = '1';
                        subTitle.style.display = 'block';
                        subTitle.style.opacity = '1';
                        mainApp.style.boxShadow = "0px 0px 20px 20px #b34545";
                    } else {
                        title.textContent = "Congratulations!";
                        subTitle.textContent = `You found a wallet with ${amount} USD!`;
                        title.style.color = "#5090c7";
                        title.style.textShadow = "6px 4px 20px #5090c7"
                        subTitle.style.textShadow = "6px 4px 20px #5090c7"
                        title.style.display = 'block';
                        title.style.opacity = '1';
                        subTitle.style.display = 'block';
                        subTitle.style.opacity = '1';
                        mainApp.style.boxShadow = "0px 0px 20px 20px #5090c7";
                    }
                    setTimeout(() => {
                        start.id = "";
                        mainApp.style = "";
                        spinFinished();
                    }, 2500);
                }, 300);
            }, 300);
    }, 900);
}