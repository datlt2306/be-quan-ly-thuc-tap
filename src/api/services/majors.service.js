import mongoose from 'mongoose';
import MajorModel from '../models/major.model';
import createHttpError from 'http-errors';
import {
	validateDataArrayMajor,
	validateDataMajor,
	validateDataUpdateMajor,
} from '../validation/major.validation';

// get all
export const getAllMajors = async (campus) => {
	try {
		const majors = await MajorModel.find({
			campus: campus,
		});

		return majors;
	} catch (error) {
		throw error;
	}
};

// get one
export const getOneMajor = async (id, campus) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw createHttpError(400, 'Id phải là type objectId');
		}
		const major = await MajorModel.findOne({
			campus: campus,
			_id: id,
		}).populate('campus');

		if (!major) {
			throw createHttpError(404, 'Ngành học không tồn tại');
		}

		return major;
	} catch (error) {
		throw error;
	}
};

// update
export const updateMajor = async (id, data, campus) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw createHttpError(400, 'Id phải là type objectId');
		}

		if (Object.keys(data).length === 0) {
			throw createHttpError(304);
		}

		// validate
		const { error } = validateDataUpdateMajor(data);
		if (error) {
			throw createHttpError(400, error.message);
		}

		// check tồn tại
		const major = await getOneMajor(id, campus);

		const majorNew = await MajorModel.findOneAndUpdate(
			{
				_id: id,
			},
			data,
			{ new: true }
		);

		return majorNew;
	} catch (error) {
		throw error;
	}
};

// delete
export const deleteMajor = async (id, campus) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw createHttpError(400, 'Id phải là type objectId');
		}

		// check tồn tại
		await getOneMajor(id, campus);

		const major = await MajorModel.findOneAndDelete({
			_id: id,
		});

		return major;
	} catch (error) {
		throw error;
	}
};

// create list
export const createMajorList = async (data, campus) => {
	try {
		if (!Array.isArray(data)) throw createHttpError(400, 'Data major phải là kiểu mảng');

		if (data.length === 0) {
			throw createHttpError(204);
		}

		// validate
		const { error } = validateDataArrayMajor(data);

		if (error) {
			throw createHttpError(400, error.message);
		}

		// check tồn tại
		const codeMajorList = data.map((item) => item.majorCode);
		const majorExist = await MajorModel.find({
			majorCode: { $in: codeMajorList },
			campus: campus,
		}).lean();

		if (majorExist.length > 0) {
			throw createHttpError(409, 'Các mã ngành đã tồn tại', {
				error: majorExist.map((item) => item.majorCode),
			});
		}

		data = data.map((item) => ({ ...item, campus: campus }));

		// thêm
		const result = await MajorModel.insertMany(data);

		return result;
	} catch (error) {
		throw error;
	}
};

// create one
export const createOneMajor = async (data, campus) => {
	try {
		if (Object.keys(data).length === 0) {
			throw createHttpError(204);
		}

		// validate
		const { error } = validateDataMajor(data);
		if (error) {
			throw createHttpError(400, error.message);
		}

		// check tồn tại
		const major = await MajorModel.findOne({
			majorCode: data.majorCode,
			campus: campus,
		});

		if (major) {
			throw createHttpError(409, 'Mã ngành học đã tồn tại');
		}

		// create
		return await new MajorModel({
			...data,
			campus: campus,
		}).save();
	} catch (error) {
		throw error;
	}
};
