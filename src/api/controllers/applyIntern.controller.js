import { sendMail } from './email.controller';
import Student from '../models/student.model';
import { emailTemplates } from '../../utils/emailTemplate';

// Tạo email mới dựa theo template
const generateEmail = (name, email, type) => {
	const template = emailTemplates[type];

	if (!template) throw new Error(`Invalid email type: ${type}`);
	
	return { mail: email, subject: template.subject, content: template.content(name) };
};

/*
 * Fields to include in request body:
 *
 * - address (string): address of applicant
 * - dream (string): applicant's desired position
 * - CV (file): applicant's CV file
 * - nameCompany (string): name of company being applied to
 * - addressCompany (string): address of company being applied to
 * - taxCode (string): tax code of company being applied to
 * - position (string): position being applied for
 * - phoneNumberCompany (string): phone number of company being applied to
 * - emailEnterprise (string): email of company being applied to
 * - business (string): business type of company being applied to
 * - mssv (string): applicant's student ID
 * - narrow (string): narrow of applicant's dream
 * - signTheContract (file): signed contract file
 *
 */
export const signUpCVForSupport = async (req, res) => {
	try {
		const { support, mssv, email, name, majorCode, ...rest } = req.body;
		// update student trừ các field mssv, name, majorCode, email
		const update = { ...rest, support, statusCheck: support ? 0 : 2 };
		const filter = { email, mssv: mssv.toLowerCase() };

		const findStudent = await Student.findOne(filter);

		if (!findStudent) {
			res.status(500).send({
				message: 'Thông tin của bạn không tồn tại trên hệ thống!',
			});
			return;
		}
		if (findStudent.statusCheck === 0) {
			res.status(500).send({
				message: 'Thông tin CV của bạn đã được đăng ký',
			});
			return;
		}

		if (
			(findStudent.numberOfTime === 2 && findStudent.statusCheck === 1) ||
			(findStudent.numberOfTime === 2 && findStudent.statusCheck <= 3)
		) {
			res.status(500).send({
				message: 'Tài khoạn của bạn đã vượt quá số lần đăng ký thông tin thực tập',
			});
		}

		// if (findStudent.statusCheck === 1 && findStudent.support === 0) {
		//   return res
		//     .status(500)
		//     .send({ message: "Thông tin tự đăng ký người dùng không được sửa" });
		// }
		if (findStudent.statusCheck === 1 && findStudent.support === 1) {
			//Ho tro
			update.note = null;
			const rptest = await Student.findOneAndUpdate(filter, update, {
				new: true,
			});

			await sendMail(generateEmail(mail, name, 'internshipSupportUpdated'));

			return res.status(200).send({ message: 'Sửa thông tin CV thành công!', support });
		}

		if (findStudent.statusCheck === 10 && support === 1) {
			await Student.findOneAndUpdate(filter, update, {
				new: true,
			});

			await sendMail(generateEmail(email, name, 'internshipSupportRegistered'));
			return res
				.status(200)
				.send({ message: 'Đăng ký thông tin thành công!', support: support });
		}

		if (findStudent.statusCheck === 1 && findStudent.support === 0) {
			// if (findStudent.numberOfTime >= 2) {
			//   res.status(500).send({
			//     message: "Bạn đã vượt quá 2 lần cho phép sửa thông tin tự đăng ký!",
			//     support: support,
			//   });
			// }

			const count = findStudent.numberOfTime + 1;
			update.numberOfTime = count;
			update.note = null;
			await Student.findOneAndUpdate(filter, update, {
				new: true,
			});

			await sendMail(generateEmail(email, name, 'selfInternshipUpdated'));

			return res
				.status(200)
				.send({ message: 'Sửa thông tin CV thành công!', support: support });
		}

		if (findStudent.statusCheck === 10 && support === 0) {
			await Student.findOneAndUpdate(filter, update, {
				new: true,
			});

			await sendMail(generateEmail(email, name, 'selfInternshipRegistered'));

			return res
				.status(200)
				.send({ message: 'Đăng ký thông tin thành công!', support: support });
		}
	} catch (error) {
		return res.status(500).send({
			message: 'Đã xảy ra lỗi! Đăng ký lại sau ít phút!',
		});
	}
};
