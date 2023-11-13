export default function enableTesting(enable) {
    const testBlock = document.querySelector('.mainAppContener');
    const notDisplay = document.querySelector('.getStartedContener');
    if (enable) {
        testBlock.style = 'top: 4%;';
        notDisplay.style = 'display: none;';
    }
}

