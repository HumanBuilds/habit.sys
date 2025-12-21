export function isInputInvalid(value: string | undefined): boolean {
    return !value || value.trim() === '';
}
