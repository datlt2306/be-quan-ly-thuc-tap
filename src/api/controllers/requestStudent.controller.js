import { defaultCvStudent, defaultForm, defaultReport } from '../../utils/defaultValueStudent';
import Request from '../models/studentRequest.model';
import Student from '../models/student.model';
import { getMailTemplate } from '../../utils/emailTemplate';
import { sendMail } from '../services/mail.service';
import { StudentStatusEnum } from '../constants/studentStatus';
import MailTypes from '../constants/mailTypes';
import { StudentReviewTypeEnum } from '../constants/reviewTypeEnum';
import { HttpException } from '../../utils/httpException';
import createHttpError from 'http-errors';
import { deleteFile, extractFileID } from '../services/googleDrive.service';
import { isValidObjectId } from 'mongoose';
import studentModel from '../models/student.model';

export async function sendRequestToManager(req, res) {
	const findRequest = await Request.findOne({
		userId: req.body.userId
	});

	try {
		await Request.create(req.body);

		return res.status(201).json({
			success: true,
			message: 'Thành công'
		});
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
}

export async function getRequestOfStudent(req, res) {
	try {
		const data = await Request.find(req.query).populate('userId');
		return res.status(200).json({
			success: true,
			data: data
		});
	} catch (err) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
}

/**
 * PATCH request expects an object
 *
 * @param {action} boolean value, denied = 0, approved = 1
 * @param {type} StudentReviewTypeEnum 'cv', 'report', or 'record'
 *
 */
export async function processRequest(req, res) {
	let fileID, updateStudentStatus, emailType;

	try {
		const { action, type } = req.body;
		const { id } = req.params;

		if (!isValidObjectId(id)) throw createHttpError(400, 'ID sai định dạng');
		if (action === undefined || !type) throw createHttpError(400, 'Thông tin sai hoặc thiếu');

		const student = await studentModel.findById(id);
		if (!student) throw createHttpError(404, 'Không tìm thấy học sinh');

		if (!action) {
			emailType = MailTypes.DENIED_REQUEST;
			const result = await Request.findOneAndDelete({ userId: id, type });

			if (!result) throw createHttpError(404, 'Không tìm thấy yêu cầu');

			await sendMail({ recipients: student.email, ...getMailTemplate(emailType) });

			return res.status(200).send('Huỷ yêu cầu thành công');
		}

		// Kiểm tra loại request
		switch (type) {
			case StudentReviewTypeEnum.REVIEW_CV:
				updateStudentStatus = 10; // Chưa đăng ký
				fileID = extractFileID(student.CV);
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

		const result = await studentModel.findByIdAndUpdate(id, { statusCheck: updateStudentStatus }, { new: true });

		emailType = MailTypes.ACCEPTED_REQUEST;

		await sendMail({
			recipients: student.email,
			...getMailTemplate(type, StudentStatusEnum[result.statusCheck])
		});

		return res.status(200).json({ message: 'Xác nhận yêu cầu thành công' });
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
}

//! DEPRECATED
export async function resetStudent(req, res) {
	const { type, id, useId } = req.body;
	let valueReset = {};
	if (type === process.env.cv) {
		valueReset = defaultCvStudent;
	}
	if (type === process.env.form) {
		valueReset = defaultForm;
	}
	if (type === process.env.report) {
		valueReset = defaultReport;
	}

	try {
		Student.findOneAndUpdate({ _id: req.params.id }, valueReset, { new: true })
			.then((r) =>
				Request.findByIdAndUpdate(
					id,
					{
						status: 2
					},
					{ new: true }
				)
			)
			.then((r) =>
				res.status(200).json({
					success: true,
					message: 'Thành công'
				})
			);
	} catch (error) {
		res.status({
			success: false,
			message: 'Có lỗi sảy ra'
		});
	}
}
//! DEPRECATED

export async function cancelResetStudent(req, res) {
	try {
		await Request.findByIdAndUpdate(req.params.id, {
			status: 3
		});

		res.status(200).json({
			success: true,
			message: 'Thành công'
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: 'Thất bại'
		});
	}
}
