export function isURL(text: string) {
    return /^\w+:\/\/\S+/.test(text);
}
