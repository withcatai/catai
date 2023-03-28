const THRESHOLD = 20;

export function needScroll(el: HTMLElement) {
    return el.scrollTop + el.clientHeight > el.scrollHeight - THRESHOLD;
}
export default function scrollToEnd(el: HTMLElement) {
    el.scrollTop = el.scrollHeight;
}