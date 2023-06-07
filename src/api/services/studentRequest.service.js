import StudentModel from '../models/student.model';
import StudentRequestModel from '../models/studentRequest.model';
import MailTypes from '../constants/mailTypes';
import createHttpError from 'http-errors';

import * as defaultValue from '../../utils/defaultValueStudent';
import { getMailTemplate } from '../../utils/emailTemplate';
import { sendMail } from '../services/mail.service';
import { StudentStatusEnum } from '../constants/studentStatus';
import { StudentReviewTypeEnum } from '../constants/reviewTypeEnum';
import { deleteFile, extractFileID } from '../services/googleDrive.service';
import { isValidObjectId } from 'mongoose';
import studentModel from '../models/student.model';

export const getRequest = async (filter) => await StudentRequestModel.find(filter);

export const createRequest = async (data) => {
	try {
		const requestExist = await StudentRequestModel.findOne({ userId: data.userId, type: data.type });

		if (requestExist.status === 3) throw createHttpError(400, 'Bạn đã vượt quá số lần gửi yêu cầu (tối đa 3 lần)');

		return await new StudentRequestModel({ ...data, status: requestExist.status + 1 || 0 }).save();
	} catch (error) {
		throw error;
	}
};

// /**
//  * processRequest expects an object
//  *
//  * @param {action} boolean value, denied = 0, approved = 1, hard reset = 2
//  * @param {type} StudentReviewTypeEnum 'cv', 'report', or 'record'
//  *
//  */
// export const processRequest = async (body, params) => {
// 	try {
// 		let fileID, updateStudentStatus, emailType;
// 		const { action, type } = body;
// 		const { id } = params;

// 		if (!isValidObjectId(id)) throw createHttpError(400, 'ID sai định dạng');
// 		if (action === undefined || !type) throw createHttpError(400, 'Thông tin sai hoặc thiếu');

// 		const student = await StudentModel.findById(id);

// 		if (!student) throw createHttpError(404, 'Không tìm thấy học sinh');

// 		//action == 0 -> denied
// 		if (!action) {
// 			const requestDeniedRemove = await StudentRequestModel.findOneAndDelete({ userId: id, type });
// 			emailType = MailTypes.DENIED_REQUEST;

// 			if (!requestDeniedRemove) throw createHttpError(404, 'Không tìm thấy yêu cầu');

// 			await sendMail({ recipients: student.email, ...getMailTemplate(emailType) });

// 			return { status: 200, data: 'Huỷ yêu cầu thành công' };
// 		}

// 		// Check request type
// 		switch (type) {
// 			case StudentReviewTypeEnum.REVIEW_CV:
// 				fileID = extractFileID(student.CV);
// 				updateStudentStatus = 10; // Chưa đăng ký
// 				break;
// 			case StudentReviewTypeEnum.REVIEW_RECORD:
// 				fileID = extractFileID(student.form);
// 				updateStudentStatus = 2; // Nhận CV
// 				break;
// 			case StudentReviewTypeEnum.REVIEW_REPORT:
// 				fileID = extractFileID(student.report);
// 				updateStudentStatus = 6; // Đang thực tập
// 				break;
// 			default:
// 				throw createHttpError(400, `Không tìm thấy type: ${type}`);
// 		}

// 		// Delete file on Google Drive. No user notification needed
// 		if (fileID) await deleteFile(fileID);

// 		const result = await StudentModel.findByIdAndUpdate(id, { statusCheck: updateStudentStatus }, { new: true });
// 		const requestApprovedRemove = await StudentRequestModel.findOneAndDelete({ userId: id, type });

// 		if (!requestApprovedRemove) throw createHttpError(404, 'Không tìm thấy yêu cầu');

// 		emailType = MailTypes.ACCEPTED_REQUEST;

// 		await sendMail({
// 			recipients: student.email,
// 			...getMailTemplate(type, StudentStatusEnum[result.statusCheck])
// 		});

// 		return { status: 200, data: { message: 'Xác nhận yêu cầu thành công' } };
// 	} catch (error) {
// 		throw error;
// 	}
// };

export const processRequest = async (body, params) => {
	try {
		const { action, type } = body;
		const { id } = params;

		if (!isValidObjectId(id)) throw createHttpError(400, 'ID sai định dạng');
		if (action === undefined || !type) throw createHttpError(400, 'Thông tin sai hoặc thiếu');

		const isRequestValid = await getRequest({ userId: id, type });

		if (!isRequestValid) throw createHttpError(404, 'Không tìm thấy yêu cầu của sinh viên');

		const result = await handleAction(action, id, type);
		return result;
	} catch (error) {
		throw error;
	}
};

// Action Handler
const handleAction = async (action, id, type, student) => {
	try {
		if (action === 0) {
			return await handleDenied(id, type); // denied
		} else if (action === 1) {
			return await handleApproved(id, type); // approved
		} else if (action === 2) {
			return await handleReset(id, type); // hard reset
		}
	} catch (error) {
		throw error;
	}
};

// Handle rejected student request
const handleDenied = async (id, type) => {
	let emailType = MailTypes.DENIED_REQUEST;

	try {
		// Delete request after rejection
		await StudentRequestModel.findOneAndDelete({ userId: id, type });
		await sendMail({ recipients: student.email, ...getMailTemplate(emailType) });

		return { status: 200, data: 'Huỷ yêu cầu thành công' };
	} catch (error) {
		throw error;
	}
};

// Handle approved student request
const handleApproved = async (id, type) => {
	let fileID,
		updateStudentStatus,
		emailType = MailTypes.ACCEPTED_REQUEST;

	try {
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

		await StudentRequestModel.findOneAndDelete({ userId: id, type });
		await sendMail({
			recipients: student.email,
			...getMailTemplate(type, StudentStatusEnum[result.statusCheck])
		});

		return { status: 200, data: 'Châp nhận yêu cầu thành công' };
	} catch (error) {
		throw error;
	}
};

// Reset student's information
const handleReset = async (id, type) => {
	let resetValue;
	let student = await studentModel.findById(id);

	switch (type) {
		case StudentReviewTypeEnum.REVIEW_CV:
			fileID = extractFileID(student.CV);
			resetValue = defaultValue.defaultCvStudent;
			break;
		case StudentReviewTypeEnum.REVIEW_RECORD:
			fileID = extractFileID(student.form);
			resetValue = defaultValue.defaultForm;
			break;
		case StudentReviewTypeEnum.REVIEW_REPORT:
			throw createHttpError(400, 'Báo cáo không được reset');
		default:
			throw createHttpError(400, `Không tìm thấy type: ${type}`);
	}
	const result = await studentModel.findByIdAndUpdate(id, resetValue, { new: true });
	return { status: 200, data: 'Xác nhận yêu cầu thành công' };
};
