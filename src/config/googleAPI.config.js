import { google } from 'googleapis';

const credentials = require('../credentials/credentials.json');
const authClient = new google.auth.JWT(
	credentials.client_email,
	null,
	credentials.private_key.replace(/\\n/g, '\n'),
	['https://www.googleapis.com/auth/drive']
);

const { token } = authClient.authorize();

authClient.setCredentials(token);

export const drive = google.drive({
	version: 'v3',
	auth: authClient,
});
