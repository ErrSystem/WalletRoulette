const lever = document.querySelector('.getStartedContener .lever');
const leverBatton = document.querySelector('.getStartedContener .lever .batton');
const impact = document.querySelector('.getStartedContener img');
const btn = document.querySelector('a');

const clickAnimation = () => {
    // animation for the lever
    lever.id = "clickLever1";
    setTimeout(() => {
        leverBatton.style.transform = 'rotate(180deg)';
        lever.id = "clickLever2";
        setTimeout(() => {
            impact.style.display = 'block';
            lever.id = 'inclinedLever';
            animationDone();
        }, 100);
    }, 130);
    setTimeout(() => {
        lever.style.right = '100px';
        impact.style.opacity = '0';
        document.querySelector('.getStarted').id = "";
        setTimeout(() => {
            impact.style = '';
            setTimeout(() => {
                leverBatton.style = '';
                document.querySelector('body').style.opacity = '0';
                setTimeout(() => {
                    document.location.href = './Dapp/index.html'
                }, 400);
            }, 120);
        }, 500);
    }, 500);
}

const firstAnimation = () => {
    btn.style.opacity = '0';
    leverBatton.style.transform = 'rotate(180deg)';
    document.querySelector('.getStarted').id = "getStartedShake";
    setTimeout(() => {
        lever.style.right = '-71px';
        setTimeout(() => {
            lever.id = "incliningLever1";
            setTimeout(() => {
                leverBatton.style.transform = 'rotate(0deg)';
                lever.id = "incliningLever2";
                setTimeout(() => {
                    lever.id = '';
                    document.querySelector('.lever .boule').addEventListener('click', () => {
                        clickAnimation();
                    })
                }, 150);
            }, 130);
        }, 500);
    }, 500);
}

btn.addEventListener('click', () => {
    firstAnimation();
})

