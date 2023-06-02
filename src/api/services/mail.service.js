import transporter from '../../config/nodemailer.config';

/**
 * @param {{recipients: Array<string>|string, subject: string, html: string}}
 * @returns {Promise<any>}
 */
export const sendMail = async ({ recipients, subject, html }) => {
	try {
		if (Array.isArray(recipients)) {
			const sendMailPromises = recipients.map(
				(recipient) =>
					new Promise((resolve, reject) => {
						const options = {
							from: { address: process.env.USER_EMAIL, name: 'Phòng Quan Hệ Doanh Nghiệp' },
							to: recipient,
							subject,
							html
						};
						transporter.sendMail(options, (err, info) => {
							if (err) {
								reject(err);
							} else {
								console.log('info :>> ', info);
								resolve(info);
							}
						});
					})
			);

			return await Promise.race(sendMailPromises);
		}
		const options = {
			from: { address: process.env.USER_EMAIL, name: 'Phòng Quan Hệ Doanh Nghiệp' },
			to: recipients,
			subject,
			html
		};
		return new Promise((resolve, reject) =>
			transporter.sendMail(options, (err, info) => {
				if (err) {
					reject(err);
				} else {
					console.log('info :>> ', info);
					resolve(info);
				}
			})
		);
	} catch (error) {
		throw error;
	}
};
