const cheatyDocument = eval("document") as Document & typeof globalThis;

export function inputIntoTerminal(value: string) {
    var terminalInputElement = cheatyDocument.getElementById('terminal-input') as HTMLInputElement;
    terminalInputElement.value = value;
    const handler = Object.keys(terminalInputElement)[1];
    terminalInputElement.focus();
    terminalInputElement[handler].onChange({ target: terminalInputElement });
    setTimeout(() => {terminalInputElement[handler].onKeyDown({ key: 'Enter', preventDefault: () => null })}, 200)
}

export function inputIntoTerminalNoEnter(value: string) {
    var terminalInputElement = cheatyDocument.getElementById('terminal-input') as HTMLInputElement;
    terminalInputElement.value = value;
    const handler = Object.keys(terminalInputElement)[1];
    terminalInputElement[handler].onChange({ target: terminalInputElement });
}