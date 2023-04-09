import createHttpError from 'http-errors';
import ManagerModel from '../models/manager';
import mongoose from 'mongoose';
import {
	validateManagerDataCreate,
	validateManagerDataUpdate,
} from '../validation/manager.validation';

// get list
export const getListManager = async (campus) => {
	try {
		return await ManagerModel.find({
			campus_id: campus,
		});
	} catch (error) {
		throw error;
	}
};

// get one
export const getOneManager = async (id, campus) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw createHttpError(400, 'Id không phải type objectId');
		}

		const manager = await ManagerModel.findOne({
			campus_id: campus,
			_id: id,
		});

		if (!manager) {
			throw createHttpError(404, 'Tài liệu không tồn tại');
		}

		return manager;
	} catch (error) {
		throw error;
	}
};

// create
export const createManager = async (data, campus) => {
	try {
		if (Object.keys(data).length === 0) {
			throw createHttpError(204);
		}

		const { error } = validateManagerDataCreate(data);
		if (error) {
			throw createHttpError(400, error.message);
		}

		// check tồn tại
		const manager = await ManagerModel.findOne({
			email: data.email,
			campus_id: campus,
		});

		if (manager) {
			throw createHttpError(409, 'Manager đã tồn tại vui lòng kiểm tra lại');
		}

		// create
		const result = await new ManagerModel({
			...data,
			campus_id: campus,
		}).save();

		return result;
	} catch (error) {
		throw error;
	}
};

// update
export const updateManager = async (id, data, campus) => {
	try {
		if (Object.keys(data).length === 0) {
			throw createHttpError(304);
		}

		// validate
		const { error } = validateManagerDataUpdate(data);
		if (error) {
			throw createHttpError(400, error.message);
		}

		// check tồn tại
		await getOneManager(id, campus);

		// update
		const result = await ManagerModel.findOneAndUpdate(
			{
				_id: id,
				campus_id: campus,
			},
			data,
			{
				new: true,
			}
		);

		return result;
	} catch (error) {
		throw error;
	}
};

// delete
export const deleteManager = async (id, campus) => {
	try {
		// check tồn tại
		await getOneManager(id, campus);

		// update
		const result = await ManagerModel.findOneAndDelete({
			_id: id,
			campus_id: campus,
		});

		return result;
	} catch (error) {
		throw error;
	}
};
