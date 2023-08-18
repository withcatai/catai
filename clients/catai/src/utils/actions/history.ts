const MAX_ITEMS = 40;
export function getHistory(): string[] {
    return JSON.parse(localStorage.getItem('history') || '[]');
}

export function saveHistory(history: string[]){
    localStorage.setItem('history', JSON.stringify(history));
}

export function appendPromptToHistory(prompt: string){
    const history = getHistory().filter(x => x != prompt);
    history.unshift(prompt);
    saveHistory(history.slice(0, MAX_ITEMS));
}