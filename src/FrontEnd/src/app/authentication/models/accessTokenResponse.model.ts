import { DateTimeString } from '../../../common/models';

export default interface AccessTokenResponse {
    tokenType: string;
    accessToken: string;
    expires?: DateTimeString;
    expiresIn: number;
    refreshToken: string;
}
