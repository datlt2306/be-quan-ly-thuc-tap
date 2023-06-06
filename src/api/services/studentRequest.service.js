import StudentModel from '../models/student.model';
import StudentRequestModel from '../models/studentRequest.model';
import MailTypes from '../constants/mailTypes';
import createHttpError from 'http-errors';

import { getMailTemplate } from '../../utils/emailTemplate';
import { sendMail } from '../services/mail.service';
import { StudentStatusEnum } from '../constants/studentStatus';
import { StudentReviewTypeEnum } from '../constants/reviewTypeEnum';
import { deleteFile, extractFileID } from '../services/googleDrive.service';
import { isValidObjectId } from 'mongoose';

export const getRequest = async (filter) => await StudentRequestModel.find(filter);

export const createRequest = async (data) => await new StudentRequestModel(data).save();

/**
 * processRequest expects an object
 *
 * @param {action} boolean value, denied = 0, approved = 1
 * @param {type} StudentReviewTypeEnum 'cv', 'report', or 'record'
 *
 */
export const processRequest = async (body, params) => {
	try {
		let fileID, updateStudentStatus, emailType;
		const { action, type } = body;
		const { id } = params;

		if (!isValidObjectId(id)) throw createHttpError(400, 'ID sai định dạng');
		if (action === undefined || !type) throw createHttpError(400, 'Thông tin sai hoặc thiếu');

		const student = await StudentModel.findById(id);

		if (!student) throw createHttpError(404, 'Không tìm thấy học sinh');

		//action == 0 -> denied
		if (!action) {
			const requestDeniedRemove = await StudentRequestModel.findOneAndDelete({ userId: id, type });
			emailType = MailTypes.DENIED_REQUEST;

			if (!requestDeniedRemove) throw createHttpError(404, 'Không tìm thấy yêu cầu');

			await sendMail({ recipients: student.email, ...getMailTemplate(emailType) });

			return { status: 200, data: 'Huỷ yêu cầu thành công' };
		}

		// Check request type
		switch (type) {
			case StudentReviewTypeEnum.REVIEW_CV:
				fileID = extractFileID(student.CV);
				updateStudentStatus = 10; // Chưa đăng ký
				break;
			case StudentReviewTypeEnum.REVIEW_RECORD:
				fileID = extractFileID(student.form);
				updateStudentStatus = 2; // Nhận CV
				break;
			case StudentReviewTypeEnum.REVIEW_REPORT:
				fileID = extractFileID(student.report);
				updateStudentStatus = 6; // Đang thực tập
				break;
			default:
				throw createHttpError(400, `Không tìm thấy type: ${type}`);
		}

		// Delete file on Google Drive. No user notification needed
		if (fileID) await deleteFile(fileID);

		const result = await StudentModel.findByIdAndUpdate(id, { statusCheck: updateStudentStatus }, { new: true });
		const requestApprovedRemove = await StudentRequestModel.findOneAndDelete({ userId: id, type });

		if (!requestApprovedRemove) throw createHttpError(404, 'Không tìm thấy yêu cầu');

		emailType = MailTypes.ACCEPTED_REQUEST;

		await sendMail({
			recipients: student.email,
			...getMailTemplate(type, StudentStatusEnum[result.statusCheck])
		});

		return { status: 200, data: { message: 'Xác nhận yêu cầu thành công' } };
	} catch (error) {
		throw error;
	}
};
