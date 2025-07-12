import { OAuth2Client } from 'google-auth-library';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_AUTH_CLIENT_ID,
  process.env.GOOGLE_AUTH_CLIENT_SECRET,
  process.env.GOOGLE_AUTH_REDIRECT_URI,
);

//Генеруємо Google OAuth URL
export const generateGoogleAuthLink = () => {
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'openid',
    ],
    prompt: 'consent',
  });

  return authorizeUrl;
};

export default oauth2Client;
