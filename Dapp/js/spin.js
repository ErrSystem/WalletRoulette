import { state, amount } from "./generate.js";
export default function spin() {
    const getStarted = document.querySelector('.getStartedContener');
    const mainAppContener = document.querySelector('.mainAppContener');
    const mainApp = document.querySelector('.mainAppContener .mainApp');
    document.querySelector('body').style.overflow = 'hidden';
    getStarted.id = "getStartedSpinning";
    setTimeout(() => {
        getStarted.style.display = "none"; 
        mainAppContener.id = "mainAppSpinning";
        setTimeout(() => {
            mainAppContener.style.animationDuration = ".4s";
            setTimeout(() => {
                mainAppContener.style.animationDuration = ".2s";
                setTimeout(() => {
                    mainAppContener.style.animationDuration = ".1s";
                        setTimeout(() => {
                            mainAppContener.style.animation = "none";
                            mainAppContener.id = '';
                            document.querySelector('body').style.overflow = 'auto';
                            const title = document.querySelector('.mainAppContener #spinPopUp');
                            const subTitle = document.querySelector('.mainAppContener #spinPopUpSub');
                            if (!state) {
                                title.textContent = "Try Again!";
                                subTitle.textContent = "Empty Wallet (0 USD)";
                                title.style.display = 'block';
                                title.style.opacity = '1';
                                subTitle.style.display = 'block';
                                subTitle.style.opacity = '1';
                                mainApp.style.boxShadow = "0px 0px 20px 20px #b34545";
                                mainApp.style.filter = "brightness(0.2) blur(2px)";
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
                                mainApp.style.filter = "brightness(0.2) blur(2px)";
                            }
                            setTimeout(() => {
                                title.style.opacity = '0';
                                subTitle.style.opacity = '0';
                                mainApp.style = "";
                                setTimeout(() => {
                                    title.style.display = 'none';
                                    subTitle.style.display = 'none';
                                }, 500);
                            }, 3500);
                        }, 500);
                }, 500);
            }, 500);
        }, 500);
    }, 1500);
}