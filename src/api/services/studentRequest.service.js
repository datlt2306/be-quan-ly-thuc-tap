import StudentModel from '../models/student.model';
import StudentRequestModel from '../models/studentRequest.model';
import { deleteFile, extractFileID } from '../services/googleDrive.service';

// Enums and Templates
import { StudentStatusEnum } from '../constants/studentStatus';
import { StudentReviewTypeEnum } from '../constants/reviewTypeEnum';
import { RequestActionEnum } from '../constants/requestAction';
import { getMailTemplate } from '../../utils/emailTemplate';
import { sendMail } from '../services/mail.service';
import MailTypes from '../constants/mailTypes';
import * as defaultValue from '../../utils/defaultValueStudent';

// Utils
import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';
import { studentRequestValidation } from '../validation/studentRequest.validation';

export const getRequest = async (filter) => {
	try {
		const result = await StudentRequestModel.find(filter);

		if (!result) throw createHttpError(404, 'Không tìm thấy yêu cầu sinh viên');
		return result;
	} catch (error) {
		throw error;
	}
};

export const createRequest = async (data) => {
	try {
		// Check for duplicates
		const { error, value } = studentRequestValidation(data);

		if (error) throw createHttpError(400, 'Thông tin sai: ' + error.message);

		const duplicates = await getRequest({ userId: value.userId, type: value.type });

		if (duplicates.length > 2) throw createHttpError(400, 'Bạn đã vượt quá số lần gửi yêu cầu (tối đa 3 lần)');

		return await new StudentRequestModel({ ...data, status: RequestActionEnum.PENDING }).save();
	} catch (error) {
		throw error;
	}
};

/**
 * processRequest expects an object
 *
 * @param {action} number value, denied = 0, approved = 1, hard reset = 2
 * @param {type} StudentReviewTypeEnum 'cv', 'report', or 'record'
 *
 */
export const processRequest = async (body, params) => {
	try {
		const { action, type } = body;
		const { id } = params;

		if (!isValidObjectId(id)) throw createHttpError(400, 'ID sai định dạng');
		if (action === undefined || !type) throw createHttpError(400, 'Thông tin sai hoặc thiếu');

		const result = await handleAction(action, id, type);

		return result;
	} catch (error) {
		throw error;
	}
};

// Action Handler
const handleAction = async (action, id, type) => {
	try {
		const studentRequest = await StudentRequestModel.findOne({ _id: id, type });
		if (!studentRequest) throw createHttpError(404, 'Không tìm thấy yêu cầu sinh viên');

		const student = studentRequest.userId;
		if (!student) throw createHttpError(404, 'Không tìm thấy thông tin sinh viên');

		let result, requestStatus;

		if (action === 0) {
			result = await handleDenied(type, student); // denied
			requestStatus = RequestActionEnum.REJECTED;
		} else if (action === 1) {
			result = await handleApproved(type, student); // approved
			requestStatus = RequestActionEnum.ACCEPTED;
		} else if (action === 2) {
			result = await handleReset(type, student); // hard reset
			requestStatus = RequestActionEnum.ACCEPTED;
		} else throw createHttpError(400, 'action không hợp lệ');

		//* Update request status.
		studentRequest.status = requestStatus;
		await studentRequest.save();

		return result;
	} catch (error) {
		throw error;
	}
};

// Handle rejected student request
const handleDenied = async (type, student) => {
	try {
		await sendMail({ recipients: student.email, ...getMailTemplate(MailTypes.DENIED_REQUEST, type) });

		return { status: 200, data: 'Huỷ yêu cầu thành công' };
	} catch (error) {
		throw error;
	}
};

// Handle approved student request
const handleApproved = async (type, student) => {
	let fileID, studentStatus;

	try {
		// Check request type
		switch (type) {
			case StudentReviewTypeEnum.REVIEW_CV:
				fileID = extractFileID(student.CV);
				studentStatus = 10; // Chưa đăng ký
				break;
			case StudentReviewTypeEnum.REVIEW_RECORD:
				fileID = extractFileID(student.form);
				studentStatus = 2; // Nhận CV
				break;
			case StudentReviewTypeEnum.REVIEW_REPORT:
				fileID = extractFileID(student.report);
				studentStatus = 6; // Đang thực tập
				break;
			default:
				throw createHttpError(404, `Không tìm thấy type: ${type}`);
		}

		// Delete file on Google Drive. No user notification needed
		if (fileID) await deleteFile(fileID);

		await StudentModel.findByIdAndUpdate(student._id, { statusCheck: studentStatus }, { new: true });
		await sendMail({
			recipients: student.email,
			...getMailTemplate(MailTypes.ACCEPTED_REQUEST, type, StudentStatusEnum[student.statusCheck])
		});

		return { status: 200, data: 'Châp nhận yêu cầu thành công' };
	} catch (error) {
		throw error;
	}
};

// Reset student's information
const handleReset = async (type, student) => {
	let resetValue, fileID;

	try {
		switch (type) {
			case StudentReviewTypeEnum.REVIEW_CV: // Reset CV
				fileID = extractFileID(student.CV);
				resetValue = defaultValue.defaultCvStudent;
				break;
			case StudentReviewTypeEnum.REVIEW_RECORD: // Reset Both CV & Record
				fileID = extractFileID(student.form);
				resetValue = { ...defaultValue.defaultCvStudent, ...defaultValue.defaultForm };
				break;
			case StudentReviewTypeEnum.REVIEW_REPORT:
				throw createHttpError(400, 'Báo cáo không được reset');
			default:
				throw createHttpError(400, `Không tìm thấy type: ${type}`);
		}

		if (fileID) await deleteFile(fileID);

		await StudentModel.findByIdAndUpdate(student._id, resetValue, { new: true });
		await sendMail({
			recipients: student.email,
			...getMailTemplate(MailTypes.ACCEPTED_REQUEST, type, StudentStatusEnum[student.statusCheck])
		});
		return { status: 200, data: 'Xác nhận yêu cầu thành công' };
	} catch (error) {
		throw error;
	}
};
