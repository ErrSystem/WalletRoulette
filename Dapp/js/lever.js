const lever = document.querySelector('.contener .lever');

export function leverClick() {
    lever.id = "inclinedLever";
    setTimeout(() => {
        lever.style.right = '73px';
    }, 1000);
}

export function leverAnim() {
    lever.style.right = '-71px';
}