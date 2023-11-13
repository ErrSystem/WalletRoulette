let won = false;
export default function spin() {
    const getStarted = document.querySelector('.getStartedContener');
    const mainAppContener = document.querySelector('.mainAppContener');
    const mainApp = document.querySelector('.mainAppContener .mainApp');
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
                            if (!won) {
                                document.querySelector('.mainAppContener h3').style.display = 'block';
                                document.querySelector('.mainAppContener h3').style.opacity = '1';
                                mainApp.style.boxShadow = "0px 0px 20px 20px #b34545";
                                mainApp.style.filter = "brightness(0.2) blur(2px)";
                                setTimeout(() => {
                                    document.querySelector('.mainAppContener h3').style.opacity = '0';
                                    mainApp.style = "";
                                    setTimeout(() => {
                                        document.querySelector('.mainAppContener h3').style.display = 'none';
                                    }, 500);
                                }, 3500);
                            }
                        }, 500);
                }, 500);
            }, 500);
        }, 500);
    }, 1500);
}