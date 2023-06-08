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
		const requestExist = await StudentRequestModel.findOne({ userId: data.userId, type: data.type });

		if (requestExist.status === 3) throw createHttpError(400, 'Bạn đã vượt quá số lần gửi yêu cầu (tối đa 3 lần)');

		return await new StudentRequestModel({ ...data, status: requestExist.status + 1 || 0 }).save();
	} catch (error) {
		throw error;
	}
};

/**
 * processRequest expects an object
 *
 * @param {action} boolean value, denied = 0, approved = 1, hard reset = 2
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

		if (action === 0) {
			return await handleDenied(id, type, student); // denied
		} else if (action === 1) {
			return await handleApproved(id, type, student); // approved
		} else if (action === 2) {
			return await handleReset(id, type, student); // hard reset
		} else throw createHttpError(400, 'action không hợp lệ');
	} catch (error) {
		throw error;
	}
};

// Handle rejected student request
const handleDenied = async (id, type, student) => {
	try {
		// Delete request after rejection
		await StudentRequestModel.findOneAndDelete({ _id: id, type });
		await sendMail({ recipients: student.email, ...getMailTemplate(MailTypes.DENIED_REQUEST, type) });

		return { status: 200, data: 'Huỷ yêu cầu thành công' };
	} catch (error) {
		throw error;
	}
};

// Handle approved student request
const handleApproved = async (id, type, student) => {
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

		// Delete request
		await StudentRequestModel.findOneAndDelete({ _id: id, type });

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
const handleReset = async (id, type, student) => {
	let resetValue, fileID;

	try {
		if (!student) throw createHttpError(404, 'Không tìm thấy thông tin sinh viên');

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

		if (fileID) await deleteFile(fileID);

		await studentModel.findByIdAndUpdate(id, resetValue, { new: true });

		await sendMail({
			recipients: student.email,
			...getMailTemplate(MailTypes.ACCEPTED_REQUEST, type, StudentStatusEnum[student.statusCheck])
		});
		return { status: 200, data: 'Xác nhận yêu cầu thành công' };
	} catch (error) {
		throw error;
	}
};
