export default function isMobile() {
    if (window.screen.width >= 600) {
        return false;
    } else {
        return true;
    }
}