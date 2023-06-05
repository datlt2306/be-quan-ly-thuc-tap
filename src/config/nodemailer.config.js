import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	port: 465,
	auth: {
		user: process.env.USER_EMAIL,
		pass: process.env.PASS_EMAIL
	},
	tls: {
		rejectUnauthorized: false
	}
});

export default transporter;
