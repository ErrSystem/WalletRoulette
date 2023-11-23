import { state, amount } from "./generate.js";
import { spinFinished } from "./spinParameters.js";
import isMobile from "./detectSmallScreen.js";
import { updateMainApp } from "./newGenerate.js";
import { spinAmount } from "./spinParameters.js";
import { originalSpinAmount } from "./spinParameters.js";
export default function spin(lever) {
    let start;
    if (lever == 0) {
        start = document.querySelector('.getStartedContener');
    } else {
        start = document.querySelector('.mainAppContener');
    }
    const mainAppContener = document.querySelector('.mainAppContener');
    const mainApp = document.querySelector('.mainAppContener .mainApp');
    document.querySelector('body').style.overflow = 'hidden';
    if (!isMobile()) {
        start.id = "Spinning";
    }
    setTimeout(() => {
        start.style.display = "none"; 
        mainAppContener.style.display = "none";
        if (!isMobile()) {
            mainAppContener.style.top = "-155%";
        } else {
            mainAppContener.style.marginTop = "-1500px";
        }
        updateMainApp(originalSpinAmount - spinAmount - 1);
        setTimeout(() => {
            mainAppContener.style.display = "block";
            setTimeout(() => {
                if (!isMobile()) {
                    mainAppContener.style.top = "";
                } else {
                    mainAppContener.style.marginTop = "";
                }
                mainAppContener.id = '';
                document.querySelector('body').style.overflow = 'auto';
                document.querySelector('.mainChainContener').style.opacity = "1";
                const title = document.querySelector('#spinPopUp');
                const subTitle = document.querySelector('#spinPopUpSub');
                if (!state && !isMobile()) {
                    title.textContent = "Try Again!";
                    subTitle.textContent = "Empty Wallet (0 USD)";
                    title.style.display = 'block';
                    title.style.opacity = '1';
                    subTitle.style.display = 'block';
                    subTitle.style.opacity = '1';
                    mainApp.style.boxShadow = "0px 0px 20px 20px #b34545";
                    setTimeout(() => {
                        title.style.opacity = '0';
                        subTitle.style.opacity = '0';
                        setTimeout(() => {
                            subTitle.style = '';
                            title.style = '';
                        }, 300);
                    }, 1000);
                } else if (state) {
                    title.textContent = "Congratulations!";
                    subTitle.textContent = `You found a wallet with ${amount} USD!`;
                    title.style.color = "#5090c7";
                    if (!isMobile()) {
                        title.style.textShadow = "6px 4px 20px #5090c7";
                        subTitle.style.textShadow = "6px 4px 20px #5090c7";
                    } else {
                        title.style.textShadow = "6px 4px 20px #000";
                        subTitle.style.textShadow = "6px 4px 20px #000";
                    }
                    title.style.display = 'block';
                    title.style.opacity = '1';
                    subTitle.style.display = 'block';
                    subTitle.style.opacity = '1';
                    if (!isMobile()) {
                        mainApp.style.boxShadow = "0px 0px 20px 20px #5090c7";
                    } else {
                        setTimeout(() => {
                            title.style.opacity = '0';
                            subTitle.style.opacity = '0';
                            setTimeout(() => {
                                subTitle.style.display = 'none';
                                title.style.display = 'none';
                            }, 300);
                        }, 1000);
                    }
                }
                setTimeout(() => {
                    start.id = "";
                    mainApp.style = "";
                    spinFinished();
                }, 3000);
            }, 300);
        }, 300);
    }, 900);
}