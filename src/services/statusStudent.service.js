import createHttpError from 'http-errors';
import StatusStudentModel from '../models/statusStudent.model';
import {
	statusStudentValidate,
	statusUpdateValidate,
} from '../validation/statusStudent.validation';

// lấy ra danh sách status
export const selectStatusAll = async (campus) => {
	try {
		const statusList = await StatusStudentModel.find({
			campus: campus,
		}).select('-contentMail');

		return statusList;
	} catch (error) {
		throw error;
	}
};

// Tạo mới 1 status
export const createStatus = async (campus, data) => {
	try {
		if (Object.keys(data).length === 0) {
			throw createHttpError(204);
		}

		// validate
		const { error } = statusStudentValidate(data);
		if (error) {
			throw createHttpError(400, error.message);
		}

		const statusResult = await new StatusStudentModel({
			...data,
			campus: campus,
		}).save();

		return statusResult;
	} catch (error) {
		throw error;
	}
};

// update
export const updateStatus = async (id, data, campus) => {
	try {
		if (Object.keys(data).length === 0) {
			throw createHttpError(304);
		}

		// validate
		const { error } = statusUpdateValidate(data);
		if (error) {
			throw createHttpError(400, error.message);
		}

		// check xem có tồn tại không
		const status = await StatusStudentModel.findOne({
			_id: id,
			campus: campus,
		});

		if (!status) {
			throw createHttpError(404, 'Status không tồn tại');
		}

		const result = await StatusStudentModel.findOneAndUpdate(
			{
				_id: id,
				campus: campus,
			},
			data,
			{ new: true }
		);

		return result;
	} catch (error) {
		throw error;
	}
};

// delete
export const deleteStatus = async (id, campus) => {
	try {
		// check xem có tồn tại không
		const status = await StatusStudentModel.findOne({
			_id: id,
			campus: campus,
		});

		if (!status) {
			throw createHttpError(404, 'Status không tồn tại');
		}

		const result = await StatusStudentModel.findOneAndDelete({
			_id: id,
			campus: campus,
		});

		return result;
	} catch (error) {
		throw error;
	}
};
