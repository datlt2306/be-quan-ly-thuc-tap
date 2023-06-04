import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';
import { getMailTemplate } from '../../utils/emailTemplate';
import { HttpException } from '../../utils/httpException';
import MailTypes from '../constants/mailTypes';
import Student from '../models/student.model';
import { uploadFile } from '../services/googleDrive.service';
import { sendMail } from '../services/mail.service';
import { requestSupportValidate, selfFindValidate } from '../validation/internApplicant.validation';

/*
 * Fields to include in request body:
 * STUDENT INFO
 * - address (string): address of applicant
 * - dream (string): applicant's desired position
 * - CV (file): applicant's CV file
 * - phoneNumber: applicant's phone number
 * - support: support type
 *
 * COMPANY INFO
 * - nameCompany (string): name of company being applied to
 * - addressCompany (string): address of company being applied to
 * - taxCode (string): tax code of company being applied to
 * - position (string): position being applied for
 * - phoneNumberCompany (string): phone number of company being applied to
 * - emailEnterprise (string): email of company being applied to
 * - employer (string): employer of company being applied to
 * - business (string): business type of company being applied to. (FOR SUPPORT)
 * - signTheContract (file/string): signed contract file. USE STRING FOR NOW
 * *
 */

export const signUpCVForSupport = async (req, res) => {
	const { support, _id, phoneNumber, address, dream } = req.body;
	try {
		const student = await Student.findById(_id);

		if (!isValidObjectId(_id)) throw createHttpError(400, 'ID không đúng định dạng');

		if (!student) {
			throw createHttpError(404, 'Thông tin của bạn không tồn tại trên hệ thống');
		}

		switch (student.statusCheck) {
			case 0: // Đang chờ kiểm tra CV hoặc đã đăng ký
			case 11:
				throw createHttpError(409, 'Thông tin CV của bạn đã được đăng ký');
			case 1: // Sửa lại CV
				if (student.numberOfTime < 3) break;
				throw createHttpError(400, 'Tài khoạn của bạn đã vượt quá số lần đăng ký thông tin thực tập');
			case 10: // Chưa đăng ký
				break;
			default:
				throw createHttpError(400, 'Bạn không đủ điểu kiện đăng ký thực tập');
		}

		let update = {
			phoneNumber,
			address,
			dream,
			support
		};

		// Cho SV đăng ký hỗ trợ
		if (support == 1) {
			const [file] = req.files;
			const { business } = req.body;
			const uploadedFile = await uploadFile(file); // Upload & Get URL

			const requestSupportUpdate = {
				business,
				CV: uploadedFile.url,
				statusCheck: 0
			};

			update = { ...update, ...requestSupportUpdate };

			const { error } = requestSupportValidate(update);

			if (error) throw createHttpError(400, 'Dữ liệu không hợp lệ: ' + error.message);
		} else {
			// Cho SV tự tìm
			const { position, taxCode, addressCompany, nameCompany, phoneNumberCompany, employer, emailEnterprise } =
				req.body;

			const selfFindUpdate = {
				position,
				addressCompany,
				taxCode,
				nameCompany,
				employer,
				phoneNumberCompany,
				emailEnterprise,
				statusCheck: 11
			};

			update = { ...update, ...selfFindUpdate };

			const { error } = selfFindValidate(update);

			if (error) throw createHttpError(400, 'Dữ liệu không hợp lệ: ' + error.message);

			update.numberOfTime = student.numberOfTime + 1;
		}

		await Student.findByIdAndUpdate(_id, update, { new: true });

		let message, emailType;

		if (student.statusCheck === 1) {
			emailType = support ? MailTypes.INTERN_SUPPORT_UPDATE : MailTypes.INTERN_SELF_FINDING_UPDATE;
		} else {
			emailType = support ? MailTypes.INTERN_SUPPORT_REGISTRATION : MailTypes.INTERN_SELF_FINDING_REGISTRATION;
		}

		// Send email
		await sendMail({ recipients: student.email, ...getMailTemplate(emailType) });

		return res.status(200).send({ message, support: update.support });
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};
