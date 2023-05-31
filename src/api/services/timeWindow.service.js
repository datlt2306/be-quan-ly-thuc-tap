import createHttpError from 'http-errors';
import TimeWindowModel from '../models/timeWindow.model';
import { getCurrentSemester } from './semester.service';
import {
	validateConfigTimeCreateData,
	validateConfigTimeUpdateData,
	TimeWindowSchema
} from '../validation/configTime.validation';
import mongoose from 'mongoose';

// Thêm 1 thời gian mở form hoặc cập nhật 1 bản cũ
export const upsertTimeWindow = async (data, semester_id, campus_id) => {
	const { _id, ...rest } = data;
	const options = { upsert: true, new: true };
	const filter = { semester_id, typeNumber: data.typeNumber };

	try {
		const { error } = TimeWindowSchema.validate(rest);
		const timeWindowData = { ...rest, campus_id, semester_id };

		if (error) throw createHttpError.BadRequest('Thông tin gửi lên không đúng định dạng');
		if (!semester_id) throw createHttpError.BadRequest('Không tìm thấy kỳ học');
		if (_id) {
			const existedDoc = await TimeWindowModel.findById(_id);
			if (!existedDoc) throw createHttpError.BadRequest('Không tìm thấy thời gian mở form');
		}

		return await TimeWindowModel.findOneAndUpdate(filter, timeWindowData, options);
	} catch (error) {
		console.error(error.message);
		throw error;
	}
};

// Tạo mới 1 thời gian mở form
//! DEPRECATED
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
		const checkExist = await TimeWindowModel.findOne({
			semester_id: semester._id,
			campus_id: campus,
			endTime: data.endTime,
			startTime: data.startTime
		});

		if (checkExist) {
			throw createHttpError(409, 'Tài liệu đã tồn tại');
		}

		return await new TimeWindowModel({
			...data,
			semester_id: semester._id,
			campus_id: campus
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

		return await TimeWindowModel.find({
			campus_id: campus,
			semester_id: semester._id
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

		const configTime = await TimeWindowModel.findOne({
			campus_id: campus,
			semester_id: semester._id,
			_id: id
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

		return await TimeWindowModel.findOneAndUpdate(
			{
				_id: id
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

		return await TimeWindowModel.findOneAndDelete({
			_id: id
		});
	} catch (error) {
		throw error;
	}
};
