const generateButton = document.querySelector('.generateButton');
const redirectTo = document.querySelector('.generate');
const loadApp = () => {
    redirectTo.style.display = 'block';
    document.querySelector('.getStarted').style.opacity = '0';
    setTimeout(() => {
        redirectTo.style.opacity = '1';
        document.querySelector('.getStarted').style.display = 'none';
    }, 300);
}
// generateButton.addEventListener('click', () => loadApp());