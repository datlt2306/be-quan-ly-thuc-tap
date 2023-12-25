import nodemailer from 'nodemailer';
import managerModel from '../models/manager.model';

/**
 * @param {{sender?: {email: string, applicationPassword: string, campus_id: {name: string}}, recipients: Array<string>|string, subject: string, html: string, campusId?: string}}
 * @returns {Promise<any>}
 */
export const sendMail = async ({ sender, recipients, subject, html, campusId }) => {
	if (!sender) {
		sender = await managerModel.findOne({ role: 1, campus_id: campusId, applicationPassword: { $ne: null } });
	}
	try {
		const transporter = nodemailer.createTransport({
			port: 465,
			dnsTimeout: 60 * 1000,
			connectionTimeout: 60 * 1000,
			tls: {
				rejectUnauthorized: false
			},
			debug: true,
			service: 'gmail',
			auth: {
				user: sender?.email,
				pass: sender?.applicationPassword
			}
		});
		const result = await transporter.sendMail({
			from: { address: sender?.email, name: `Phòng QHDN - ${sender?.campus_id?.name}` },
			to: recipients,
			subject: subject,
			html
		});
		console.log('\x1b[1;42m Success \x1b[0m', 'Nodemailer :>>>', result);
		return result;
	} catch (error) {
		console.log('\x1b[1;41m Error \x1b[0m', error);
		throw error;
	}
};
