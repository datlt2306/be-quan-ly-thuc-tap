import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.USER_EMAIL,
		pass: process.env.PASS_EMAIL
	}
});

export default transporter;
