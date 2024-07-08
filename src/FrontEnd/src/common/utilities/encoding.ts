// Adapted from: https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem

export function base64ToBytes(base64: string): Uint8Array {
    const binString = window.atob(base64);
    return Uint8Array.from(binString, (m) => m.codePointAt(0) ?? 0);
}

export function bytesToBase64(bytes: Uint8Array): string {
    const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join('');
    return window.btoa(binString);
}

export function encodeStringAsBase64(data: string): string {
    return bytesToBase64(new TextEncoder().encode(data));
}

export function encodeJsonObjectAsBase64<TObject = object>(data: TObject): string {
    return encodeStringAsBase64(JSON.stringify(data));
}

export function decodeStringFromBase64(base64String: string): string {
    return new TextDecoder().decode(base64ToBytes(base64String));
}

export function decodeJsonObjectFromBase64<TObject = object>(base64String: string): TObject {
    return JSON.parse(decodeStringFromBase64(base64String));
}
