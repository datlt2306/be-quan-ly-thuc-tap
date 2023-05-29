import { generateEmail } from '../../utils/emailTemplate';
import Student from '../models/student.model';
import { uploadFile } from '../services/googleDrive.service';
import { requestSupportValidate, selfFindValidate } from '../validation/internApplicant.validation';
import { sendMail } from './email.controller';
import { HttpException } from '../../utils/httpException';
import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

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
	const { support, _id, phoneNumber, address, dream } = req.body;
	try {
		const findStudent = await Student.findById(_id);

		if (!isValidObjectId(_id)) throw createHttpError(400, 'ID không đúng định dạng');

		if (!findStudent) {
			throw createHttpError(404, 'Thông tin của bạn không tồn tại trên hệ thống');
		}

		switch (findStudent.statusCheck) {
			case 0: // Đang chờ kiểm tra CV hoặc đã đăng ký
			case 11:
				throw createHttpError(409, 'Thông tin CV của bạn đã được đăng ký');
			case 1: // Sửa lại CV
				if (findStudent.numberOfTime < 3) break;
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
			const { position, taxCode, addressCompany, nameCompany, phoneNumberCompany, emailEnterprise } = req.body;

			const selfFindUpdate = {
				position,
				addressCompany,
				taxCode,
				nameCompany,
				phoneNumberCompany,
				emailEnterprise,
				statusCheck: 11
			};

			update = { ...update, ...selfFindUpdate };

			const { error } = selfFindValidate(update);

			if (error) throw createHttpError(400, 'Dữ liệu không hợp lệ: ' + error.message);

			update.numberOfTime = findStudent.numberOfTime + 1;
		}

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
		await sendMail(generateEmail(findStudent.email, emailType, findStudent.name));

		return res.status(200).send({ message, support: update.support });
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};
