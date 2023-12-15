import nodemailer from 'nodemailer';
import 'dotenv/config';

/**
 * @deprecated
 */
const transporter = nodemailer.createTransport({
	host: 'smtp-mail.outlook.com',
	secureConnection: false,
	port: 587,
	dnsTimeout: 60 * 1000,
	connectionTimeout: 60 * 1000,
	tls: {
		ciphers: 'SSLv3',
		rejectUnauthorized: false
	},
	debug: true,
	service: 'hotmail',
	auth: {
		user: 'datlt34@fe.edu.vn',
		pass: 'NQ46Nsl8#6kUu798'
	}
});

export default transporter;
