import { sendMail } from './email.controller';
import Student from '../models/student.model';
import { emailTemplates } from '../../utils/emailTemplate';
import { uploadFile } from '../services/googleDrive.service';
import { selfFindSchema, requestSupportSchema } from '../validation/internApplicant.validation';

// Tạo email mới dựa theo template
const generateEmail = (name, email, type) => {
	const template = emailTemplates[type];

	if (!template) throw new Error(`Invalid email type: ${type}`);

	return { mail: email, subject: template.subject, content: template.content(name) };
};

/*
 * Fields to include in request body:
 * STUDENT INFO
 * - address (string): address of applicant
 * - dream (string): applicant's desired position
 * - CV (file): applicant's CV file
 * - phoneNumber: applicant's phone number
 * - majorCode (string):  applicant's major ID
 * - support: support type
 *
 * COMPANY INFO
 * - nameCompany (string): name of company being applied to
 * - addressCompany (string): address of company being applied to
 * - taxCode (string): tax code of company being applied to
 * - position (string): position being applied for
 * - phoneNumberCompany (string): phone number of company being applied to
 * - emailEnterprise (string): email of company being applied to
 * - business (string): business type of company being applied to. (FOR SUPPORT)
 * - signTheContract (file/string): signed contract file. USE STRING FOR NOW
 * *
 */

export const signUpCVForSupport = async (req, res) => {
	const { support, _id, phoneNumber, address, dream, majorCode } = req.body;
	try {
		const findStudent = await Student.findById(_id).exec();

		if (!findStudent) {
			return res.status(500).send({
				message: 'Thông tin của bạn không tồn tại trên hệ thống!',
			});
		}
		if (findStudent.statusCheck === 0 || findStudent.statusCheck === 11) {
			return res.status(500).send({
				message: 'Thông tin CV của bạn đã được đăng ký',
			});
		}

		if (
			(findStudent.numberOfTime > 2 && findStudent.statusCheck === 1) ||
			(findStudent.numberOfTime > 2 && findStudent.statusCheck <= 3)
		) {
			return res.status(500).send({
				message: 'Tài khoạn của bạn đã vượt quá số lần đăng ký thông tin thực tập',
			});
		}

		let update = {
			phoneNumber,
			address,
			dream,
			majorCode,
			support,
			email: findStudent.email,
		};

		// Lấy request body & validate
		if (support === 1) {
			const [file] = req.files;
			// Cho SV đăng ký hỗ trợ
			const { business } = req.body;
			const uploadedFile = await uploadFile(file); // Upload & Get URL

			const requestSupportUpdate = {
				business,
				CV: uploadedFile.url,
				statusCheck: 0,
			};

			update = { ...update, ...requestSupportUpdate };

			const { error } = requestSupportSchema.validate(update);

			if (error) throw new Error(error.message);
		} else {
			// Cho SV tự tìm
			const {
				position,
				taxCode,
				addressCompany,
				nameCompany,
				phoneNumberCompany,
				emailEnterprise,
				CV,
			} = req.body;

			const selfFindUpdate = {
				position,
				addressCompany,
				taxCode,
				nameCompany,
				phoneNumberCompany,
				emailEnterprise,
				CV,
				statusCheck: 11,
			};

			update = { ...update, ...selfFindUpdate };

			const { error } = selfFindSchema.validate(update);

			if (error) throw new Error(error.message);
		}

		// Cập nhật số lần sửa thông tin
		update.numberOfTime = findStudent.numberOfTime + 1;
		update.note = null;

		await Student.findByIdAndUpdate(_id, update, { new: true });

		let message, emailType;

		if (findStudent.statusCheck === 1) {
			message = 'Sửa thông tin CV thành công!';
			emailType = support ? 'internshipSupportUpdated' : 'selfInternshipUpdated';
		} else {
			message = 'Đăng ký thông tin thành công!';
			emailType = support ? 'internshipSupportRegistered' : 'selfInternshipRegistered';
		}

		// Send email
		// await sendMail(generateEmail(email, sharedData.name, emailType));

		return res.status(200).send({ message, support: update.support });
	} catch (error) {
		console.log(error.message);
		return res.status(500).send({
			message: 'Đã xảy ra lỗi! Đăng ký lại sau ít phút!',
		});
	}
};
