import showSpinParameters from './spin.js';
import {spinAnim} from './spin.js';
const lever = document.querySelectorAll('.lever');
const leverBatton = document.querySelectorAll('.lever .batton');
const impact = document.querySelectorAll('.lever img');
let leverId;
let divId;
let leverMode;

// when you click on it
export function leverClick() {
    // remove event listener
    removeLeverListener();
    // Adds loading effect to main app
    document.querySelector('.mainChainContener').style.opacity = "0";
    // animation for the lever
    lever[leverId].id = "clickLever1";
    setTimeout(() => {
        leverBatton[leverId].style.transform = 'rotate(180deg)';
        lever[leverId].id = "clickLever2";
        setTimeout(() => {
            impact[leverId].style.display = 'block';
            lever[leverId].id = 'inclinedLever';
        }, 100);
    }, 130);
    setTimeout(() => {
        lever[leverId].style.right = '100px';
        impact[leverId].style.opacity = '0';
        document.querySelector('.getStarted').id = "";
        setTimeout(() => {
            impact[leverId].style = '';
            setTimeout(() => {
                leverBatton[leverId].style = '';
                lever[leverId].style.display = "none";
                // if the spin was stopped because the user found a wallet if he clicks again it continues spinning
                if (leverMode == "Continue") {
                    setTimeout(() => {
                        spinAnim(1);
                    }, 500);
                } else {
                    showSpinParameters(leverId);
                }
            }, 120);
        }, 500);
    }, 500);
}

// when lever appears
export function leverAnim(id, mode) {
    leverMode = mode;
    if (id == 0) {
        divId = ".getStarted";
    } else {
        divId = ".mainApp";
    }
    leverId = id;
    lever[id].style.display = "block";
    leverBatton[id].style.transform = 'rotate(180deg)';
    document.querySelector(divId).id = "Shake";
    setTimeout(() => {
        lever[id].style.right = '-71px';
        setTimeout(() => {
            lever[id].id = "incliningLever1";
            setTimeout(() => {
                leverBatton[id].style.transform = 'rotate(0deg)';
                lever[id].id = "incliningLever2";
                setTimeout(() => {
                    lever[id].id = '';
                    // add event listener
                    leverListener();
                    // cancel animation of shaking
                    document.querySelector(divId).id = "";
                }, 150);
            }, 130);
        }, 500);
    }, 500);
}

// listeners
const leverListener = () => {
    document.querySelectorAll('.lever .boule')[leverId].addEventListener('click', leverClick)
}

const removeLeverListener = () => {
    document.querySelectorAll('.lever .boule')[leverId].removeEventListener('click', leverClick);
}