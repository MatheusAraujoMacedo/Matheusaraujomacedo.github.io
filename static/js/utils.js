const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const CHAT_API_URL = '/api/chat';

function escapeHtml(text) {
    const el = document.createElement('div');
    el.textContent = text;
    return el.innerHTML;
}

function formatAiMessage(text) {
    return escapeHtml(text)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n(.*)/g, '<br>$1');
}

function isMobileDevice() {
    return window.innerWidth < 768 || 'ontouchstart' in window;
}
