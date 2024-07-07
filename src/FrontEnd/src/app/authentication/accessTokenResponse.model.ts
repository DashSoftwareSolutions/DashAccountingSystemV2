export default interface AccessTokenResponse {
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
}