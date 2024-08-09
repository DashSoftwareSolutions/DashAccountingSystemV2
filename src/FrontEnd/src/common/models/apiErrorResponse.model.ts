/**
 * API Error Response object
 * (confirming to the {@link https://datatracker.ietf.org/doc/html/rfc7807|RFC 7807} / {@link https://datatracker.ietf.org/doc/html/rfc9457|RFC 9457}
 * Problem Details specification)
 */
export default interface ApiErrorResponse {
    detail: string;
    errors?: Record<string, string[]>;
    instance: string;
    status: number;
    title: string;
    traceId?: string;
    type: string;
}
