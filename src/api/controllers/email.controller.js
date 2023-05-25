require('dotenv').config();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.USER_EMAIL,
		pass: process.env.PASS_EMAIL
	}
});

export const sendMailUser = async (req, res) => {
	try {
		//Tiến hành gửi mail, nếu có gì đó bạn có thể xử lý trước khi gửi mail
		let mailOptions = {
			from: 'FPT Polytechnic',
			to: req.body.email,
			subject: req.body.subject,
			html: req.body.content
		};

		transporter.sendMail(mailOptions, function (err, info) {
			if (err) {
				res.status(500).send({ message: err });
			} else {
				res.status(200).send({ message: 'Một email đã được gửi đến tài khoản của bạn' }); //Gửi thông báo đến người dùng
			}
		});
		// res.status(200).json(req.body.mail);
	} catch (error) {
		return res.status(500).json(error);
	}
};

export const sendMail = async (req, res) => {
	try {
		let mainOptions = {
			from: '"Phòng QHDN" <PhongQHDN@fpt.eduv.vn>',
			to: req.mail,
			subject: req.subject,
			html: req.content
		};
		transporter.sendMail(mainOptions, function (error, succes) {
			if (error) {
				return res.status(500).send({ message: 'Có lỗi xảy ra, không gửi được email' });
			} else {
				return res.status(200).send({ message: 'Gửi email thành công' });
			}
		});
	} catch (error) {
		res.status(500).json(error);
	}
};
