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

		return res.status(200).json(data);
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
