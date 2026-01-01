let fontSize = undefined;
export function setRem(fontSize_) {
    if (!fontSize_) return;
    fontSize = fontSize_;
    if (document.documentElement.style.fontSize == fontSize) return;
    document.documentElement.style.fontSize = fontSize;
}
setRem();
/** 计算的时机 */
window.addEventListener('resize', () => {
    setRem();
});
setInterval(() => {
    setRem();
}, 300);
