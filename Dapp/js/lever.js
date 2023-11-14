import {animationDone} from './transactionDone.js';
import generatePrivateKey from './test.js';
import spin from './spin.js';
const lever = document.querySelector('.getStartedContener .lever');
const leverBatton = document.querySelector('.getStartedContener .lever .batton');
const impact = document.querySelector('.getStartedContener img');

export function leverClick() {
    // launch the generation of the private key
    generatePrivateKey();
    // mouse down indicator desappears
    mouseDownAnim();
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
                // calls the spin animation
                spin();
            }, 120);
        }, 1000);
    }, 1000);
}

export function leverAnim() {
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
                }, 150);
            }, 130);
        }, 1500);
    }, 1000);
}

const mouseDownAnim = () => {
    const mouseDown = document.querySelector('.getStarted .mouseDown');
    mouseDown.style.opacity = '0';
    setTimeout(() => {
        mouseDown.style.display = 'none';
    }, 300);
}