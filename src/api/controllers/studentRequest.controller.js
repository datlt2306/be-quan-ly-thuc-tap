import { defaultCvStudent, defaultForm, defaultReport } from '../../utils/defaultValueStudent';
import StudentRequestModel from '../models/studentRequest.model';
import StudentModel from '../models/student.model';
import createHttpError from 'http-errors';
import { HttpException } from '../../utils/httpException';
import * as studentRequestService from '../services/studentRequest.service';

export async function sendRequestToManager(req, res) {
	try {
		const result = await studentRequestService.createRequest(req.body);

		return res.status(201).json({
			success: true,
			message: 'Thành công',
			result
		});
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
}

export async function getRequestOfStudent(req, res) {
	try {
		const data = await studentRequestService.getRequest(req.query);

		if (!data) throw createHttpError(404, 'Không tìm thấy yêu cầu của học sinh');

		return res.status(200).json({
			success: true,
			data: data
		});
	} catch (err) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
}

export async function processStudentRequest(req, res) {
	try {
		const result = await studentRequestService.processRequest(req.body, req.params);

		return res.status(result.status).json(result.data);
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
		await StudentModel.findOneAndUpdate({ _id: req.params.id }, valueReset, { new: true });

		await StudentRequestModel.findByIdAndUpdate(id, { status: 2 }, { new: true });

		return res.status(200).json({
			success: true,
			message: 'Thành công'
		});
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
		await StudentRequestModel.findByIdAndUpdate(req.params.id, {
			status: 3
		});

		return res.status(200).json({
			success: true,
			message: 'Thành công'
		});
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
}
