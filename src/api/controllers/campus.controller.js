import createHttpError from 'http-errors';
import Campus from '../models/campus.model';
import { HttpException } from '../../utils/httpException';

export const createCampus = async (req, res) => {
	try {
		const campusValid = await Campus.findOne({
			name: req.body.name
		});
		if (campusValid !== null) {
			res.status(202).json({
				success: false,
				message: 'Cơ sở đã tồn tại'
			});
			return;
		} else {
			const campus = await Campus.create(req.body);
			return res.status(200).json({
				campus,
				success: true,
				message: 'Thành công'
			});
		}
	} catch (error) {
		return res.status(400).json(error);
	}
};

export const getListCampus = async (req, res) => {
	try {
		const listCampus = await Campus.find().sort({ createdAt: -1 }).exec();
		return res.status(200).json(listCampus);
	} catch (error) {
		return res.status(400).json(error);
	}
};

export const getCampus = async (req, res) => {
	try {
		const campus = await Campus.findById(req.params.id);
		return res.status(200).json({
			campus,
			message: 'Get campus successfully'
		});
	} catch (error) {
		return res.status(400).json(error);
	}
};

export const updateCampus = async (req, res) => {
	try {
		const existedCampus = await Campus.exists({
			_id: { $ne: req.params.id },
			name: req.body.name
		});
		console.log('existedCampus :>> ', existedCampus);
		if (existedCampus) {
			throw createHttpError.Conflict('Tên cơ sở đã tồn tại !');
		}
		const campus = await Campus.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
		return res.status(201).json(campus);
	} catch (error) {
		console.log('error.message :>> ', error.message);
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

export const removeCampus = async (req, res) => {
	try {
		const campus = await Campus.findByIdAndRemove(req.params.id);
		res.status(200).json({
			campus,
			success: false,
			message: 'Xóa cơ sở thành công'
		});
	} catch (error) {
		res.json({
			error
		});
	}
};
