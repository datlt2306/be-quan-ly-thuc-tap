import createHttpError from 'http-errors';
import Campus from '../models/campus.model';
import { HttpException } from '../../utils/httpException';

export const createCampus = async (req, res) => {
	try {
		const campusValid = await Campus.exists({
			name: req.body.name
		});
		if (campusValid) throw createHttpError.Conflict('Cơ sở đã tồn tại !');
		const newCampus = await new Campus(req.body).save();
		return res.status(200).json(newCampus);
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
		if (existedCampus) {
			throw createHttpError.Conflict('Tên cơ sở đã tồn tại !');
		}
		const campus = await Campus.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
		return res.status(201).json(campus);
	} catch (error) {
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
