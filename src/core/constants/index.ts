export const BASE_API_PREFIX = '/api/v1';
export const USER_API_PREFIX = `${BASE_API_PREFIX}/user`;
export const AUTH_API_PREFIX = `${BASE_API_PREFIX}/auth`;
export const RESET_PASSWORD_URL = `${USER_API_PREFIX}/reset-password`;

export const MAX_LOGIN_ATTEMPT = 5;

const RESET_PASSWORD_TOKEN_EXPIRATION = 5;
export const TOKEN_EXPIRATION = RESET_PASSWORD_TOKEN_EXPIRATION * 60 * 1000; // 5 minutes
