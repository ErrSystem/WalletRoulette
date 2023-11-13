export default function spin() {
    const getStarted = document.querySelector('.getStartedContener');
    const mainApp = document.querySelector('.mainAppContener');
    getStarted.id = "getStartedSpinning";
    setTimeout(() => {
        getStarted.style.display = "none"; 
        mainApp.id = "mainAppSpinning";
        setTimeout(() => {
            mainApp.style.animationDuration = ".4s";
            setTimeout(() => {
                mainApp.style.animationDuration = ".2s";
                setTimeout(() => {
                    mainApp.style.animationDuration = ".1s";
                        setTimeout(() => {
                            mainApp.style.animation = "none";
                            mainApp.id = '';
                        }, 500);
                }, 500);
            }, 500);
        }, 500);
    }, 1500);
}