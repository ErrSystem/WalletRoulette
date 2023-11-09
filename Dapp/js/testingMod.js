export default function enableTesting(enable) {
    const testBlock = document.querySelector('.mainApp');
    const notDisplay = document.querySelector('.getStarted');
    if (enable) {
        testBlock.style = 'display: block; opacity: 1;';
        notDisplay.style = 'display: none;';
    }
}