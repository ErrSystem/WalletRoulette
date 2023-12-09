const btn = document.querySelector('.touchZone');

const clickAnimation = () => {
    btn.className = "touchZone clickedTouchZone";
    setTimeout(() => {
        btn.className = "touchZone clickedTouchZone scaling";
    }, 500);
}

btn.addEventListener('click', () => {
    clickAnimation();
    setTimeout(() => {
        document.location.href = './Dapp/';
    }, 2000);
})