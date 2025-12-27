export function isInputInvalid(value: string) {
    return !value || value.trim().length === 0;
}
