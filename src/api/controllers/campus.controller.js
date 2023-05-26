import Campus from '../models/campus.model';
import { HttpException } from '../../utils/httpException';
import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const createCampus = async (req, res) => {
	try {
		const isDuplicate = await Campus.findOne({ name: req.body.name });

		if (isDuplicate) throw createHttpError(409, 'Cơ sở đã tồn tại');

		const campus = await Campus.create(req.body);

		return res.status(200).json({
			campus,
			message: 'Tạo cơ sở thành công'
		});
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

export const getListCampus = async (req, res) => {
	try {
		const listCampus = await Campus.find().sort({ createdAt: -1 }).exec();

		if (!listCampus || !listCampus.length) throw createHttpError(404, 'Không tìm thấy danh sách cơ sở');

		return res.status(200).json({
			listCampus,
			message: 'Lấy danh sách cơ sở thành công'
		});
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

export const getCampus = async (req, res) => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) throw createHttpError(400, 'ID sai định dạng');

		const campus = await Campus.findById(id);

		if (!campus) throw createHttpError(404, 'Không tìm thấy cơ sở');

		return res.status(200).json({
			campus,
			success: true,
			message: 'Lấy cơ sở thành công'
		});
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

export const updateCampus = async (req, res) => {
	try {
		const {
			body: data,
			params: { id }
		} = req;

		if (!isValidObjectId(id)) throw createHttpError(400, 'ID sai định dạng');

		const isExist = await Campus.findOne({ name: data.name });

		if (!isExist) throw createHttpError(404, 'Cơ sở không tồn tại');

		const campus = await Campus.findByIdAndUpdate(id, data, { new: true });

		res.status(200).json({
			campus,
			success: true,
			message: 'Sửa cơ sở thành công'
		});
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

export const removeCampus = async (req, res) => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) throw createHttpError(400, 'ID sai định dạng');

		const campus = await Campus.findByIdAndRemove(id);

		if (!campus) throw createHttpError(404, 'Cơ sở không tồn tại');

		res.status(200).json({
			campus,
			success: true,
			message: 'Xóa cơ sở thành công'
		});
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};
