import crypto from 'crypto';

export const ResetPasswordTokenGenerator = () => {
    const token = crypto.randomBytes(32).toString("hex") ; // Generate a random token
    const tokenExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

    return { token, tokenExpire };
}