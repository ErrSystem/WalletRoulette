export default function enableTesting(enable) {
    const testBlock = document.querySelector('.mainAppContener');
    const mainApp = document.querySelector('.mainAppContener .mainApp');
    const results = document.querySelector('.mainAppContener .results');
    const notDisplay = document.querySelector('.getStartedContener');
    if (enable) {
        testBlock.style = 'top: 4%; display: block';
        mainApp.style.display = 'none';
        results.style.display = "block";
        notDisplay.style = 'display: none;';
    }
}

