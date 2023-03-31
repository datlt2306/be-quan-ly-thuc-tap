import NarrowModel from '../models/narrow_specialization';
import {
	validateNarrowSpecializationReqBody,
	validateNarrowSpecializationUpdate,
} from '../validation/narrowSpecialization.validation';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';

// [GET] /api/narrows
export const getNarrow = async (req, res) => {
	try {
		const campus = req.campusManager || req.campusStudent;
		// lấy ra các ngành hẹp của 1 cơ sở cụ thể
		const data = await NarrowModel.find({
			campus: campus,
		})
			.populate('id_majors')
			.sort({ createAt: -1 });
		res.status(200).json(data);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

// [POST] /api/narrow
export const insertNarrow = async (req, res) => {
	try {
		const campusManager = req.campusManager;
		const payload = req.body;

		// data gửi lên rỗng
		if (!payload || Object.keys(payload).length === 0) {
			throw createHttpError(204);
		}

		// validate payload gửi lên
		const { error } = validateNarrowSpecializationReqBody(req.body);
		if (error) {
			throw createHttpError.BadRequest(error.message);
		}

		const narrow = await NarrowModel.findOne({
			name: payload.name,
			campus: campusManager,
		}).lean();

		if (narrow) {
			throw createHttpError.Conflict(
				'Tên chuyên ngành hẹp đã tồn tại, vui lòng đặt tên khác!',
				{ success: false }
			);
		}

		// create
		const result = await new NarrowModel({
			...payload,
			campus: campusManager,
		}).save();

		return res.status(201).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

// [PUT] /api/narrow/:id
export const updateNarrow = async (req, res) => {
	try {
		const dataUpdate = req.body;
		const campusManager = req.campusManager;
		const id = req.params.id;

		if (!id || !mongoose.Types.ObjectId.isValid(id)) {
			throw createHttpError.BadRequest('id không phải type ObjectId');
		}

		// validate
		const { error } = validateNarrowSpecializationUpdate(dataUpdate);
		if (error) throw createHttpError.BadRequest(error.message);

		// check tồn tại ở cơ sở không
		const narrow = await NarrowModel.findOne({
			_id: id,
			campus: campusManager,
		});

		if (!narrow) {
			throw createHttpError.NotFound('Cơ sở hiện tại không tồn tại ngành hẹp bạn muốn sửa!');
		}

		// update
		const newNarrow = await NarrowModel.findOneAndUpdate(
			{
				_id: id,
			},
			dataUpdate,
			{
				new: true,
			}
		).populate('id_majors');

		return res.status(201).json(newNarrow);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

// [DELETE] /api/narrow/:id
export const deleteNarrow = async (req, res) => {
	try {
		const id = req.params.id;
		const campusManager = req.campusManager;

		if (!id || !mongoose.Types.ObjectId.isValid(id)) {
			throw createHttpError.BadRequest('id không phải type ObjectId');
		}

		// check tồn tại ở cơ sở không
		const narrow = await NarrowModel.findOne({
			_id: id,
			campus: campusManager,
		});

		if (!narrow) {
			throw createHttpError.NotFound('Cơ sở hiện tại không tồn tại ngành hẹp bạn muốn sửa!');
		}

		// delete
		await NarrowModel.deleteOne({
			_id: id,
		});

		return res.status(200).json({ message: ' Xóa ngành hẹp thành công' });
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};
