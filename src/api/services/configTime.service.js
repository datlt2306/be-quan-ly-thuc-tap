import createHttpError from 'http-errors';
import ConfigTimeModel from '../models/configTime.model';
import { getCurrentSemester } from '../controllers/semester.controller';
import {
	validateConfigTimeCreateData,
	validateConfigTimeUpdateData,
} from '../validation/configTime.validation';
import mongoose from 'mongoose';

// Tạo mới 1 thời gian mở form
export const createConfigTime = async (data, campus) => {
	try {
		if (Object.keys(data).length === 0) {
			throw createHttpError(204);
		}

		// validate data gửi lên
		const { error } = validateConfigTimeCreateData(data);
		if (error) {
			throw createHttpError(400, error.message);
		}

		const semester = await getCurrentSemester(campus);

		// check xem đã tồn tại chưa
		const checkExist = await ConfigTimeModel.findOne({
			semester_id: semester._id,
			campus_id: campus,
			endTime: data.endTime,
			startTime: data.startTime,
		});

		if (checkExist) {
			throw createHttpError(409, 'Tài liệu đã tồn tại');
		}

		return await new ConfigTimeModel({
			...data,
			semester_id: semester._id,
			campus_id: campus,
		}).save();
	} catch (error) {
		throw error;
	}
};

// lấy ra tất cả các thời gian mở form đã tạo
export const getListConfigTime = async (campus) => {
	try {
		// lấy ra kỳ hiện tại
		const semester = await getCurrentSemester(campus);

		return await ConfigTimeModel.find({
			campus_id: campus,
			semester_id: semester._id,
		});
	} catch (error) {
		throw error;
	}
};

// lấy ra 1
export const getOneConfigTime = async (id, campus) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw createHttpError(400, 'id không phải type ObjectId');
		}
		// lấy ra kỳ hiện tại
		const semester = await getCurrentSemester(campus);

		const configTime = await ConfigTimeModel.findOne({
			campus_id: campus,
			semester_id: semester._id,
			_id: id,
		});

		if (!configTime) {
			throw createHttpError(404, 'Tài liệu cần tìm không tồn tại');
		}

		return configTime;
	} catch (error) {
		throw error;
	}
};

// update
export const updateConfigTime = async (id, data, campus) => {
	try {
		if (Object.keys(data).length === 0) {
			throw createHttpError(304);
		}

		// validate
		const { error } = validateConfigTimeUpdateData(data);
		if (error) {
			throw createHttpError(400, error.message);
		}
		// check xem có tồn tại không
		await getOneConfigTime(id, campus);

		return await ConfigTimeModel.findOneAndUpdate(
			{
				_id: id,
			},
			data,
			{ new: true }
		);
	} catch (error) {
		throw error;
	}
};

// delete
export const deleteConfigTime = async (id, campus) => {
	try {
		// check xem có tồn tại không
		await getOneConfigTime(id, campus);

		return await ConfigTimeModel.findOneAndDelete({
			_id: id,
		});
	} catch (error) {
		throw error;
	}
};
