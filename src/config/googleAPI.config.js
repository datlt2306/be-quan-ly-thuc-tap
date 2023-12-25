import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

const credentials = require('../credentials/credentials.json');

const authClient = new JWT({
	email: credentials.client_email,
	key: credentials.private_key,
	scopes: ['https://www.googleapis.com/auth/drive']
});

async function authorize() {
	const token = await authClient.authorize();
	authClient.setCredentials(token);
}

authorize();

// Refresh token every 55 minutes
setInterval(authorize, 55 * 60 * 1000);

export const drive = google.drive({
	version: 'v3',
	auth: authClient
});
