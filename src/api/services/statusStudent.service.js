import createHttpError from 'http-errors';
import StatusStudentModel from '../models/statusStudent.model';
import { statusStudentValidate, statusUpdateValidate } from '../validation/statusStudent.validation';

// lấy ra danh sách status
export const selectStatusAll = async (campus) => {
	try {
		const statusList = await StatusStudentModel.find({
			campus
		}).select('-contentMail -titleMail');

		return statusList;
	} catch (error) {
		throw error;
	}
};

// check xem 1 status đã tồn tại ở cơ sở chưa
export const selectOneStatus = async (value, campus) => {
	try {
		const status = await StatusStudentModel.findOne({
			value,
			campus
		});

		return status;
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

		// check xem đã tồn tại chưa
		const status = await selectOneStatus(data.value, campus);

		if (status) {
			throw createHttpError(409, 'Status đã tồn tại');
		}

		const statusResult = await new StatusStudentModel({
			...data,
			campus
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
			campus
		});

		if (!status) {
			throw createHttpError(404, 'Status không tồn tại');
		}

		const result = await StatusStudentModel.findOneAndUpdate(
			{
				_id: id,
				campus
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
			campus
		});

		if (!status) {
			throw createHttpError(404, 'Status không tồn tại');
		}

		const result = await StatusStudentModel.findOneAndDelete({
			_id: id,
			campus
		});

		return result;
	} catch (error) {
		throw error;
	}
};
