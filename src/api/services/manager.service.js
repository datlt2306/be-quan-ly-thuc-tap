import createHttpError from 'http-errors';
import ManagerModel from '../models/manager.model';
import { validateManagerDataCreate, validateManagerDataUpdate } from '../validation/manager.validation';

// get list
export const getListManager = async (limit, page, ...query) => {
	const options = {
		page: +page || 1,
		limit: +limit || 10,
		customLabels: {
			totalDocs: 'pageSize',
			docs: 'data'
		}
	};
	const filter = Object.assign({}, ...query);

	try {
		if (filter.campus) options.populate = ['campus_id'];
		return await ManagerModel.paginate(filter, options);
	} catch (error) {
		throw new Error(error.message || 'Lỗi');
	}
};

// get one
export const getOneManager = async (id, ...query) => {
	try {
		let filter = Object.assign({}, ...query);
		filter._id = id;
		let result = await ManagerModel.findOne(filter).populate('campus_id').exec();

		if (!result) throw createHttpError(404, 'Tài liệu không tồn tại');

		return result;
	} catch (error) {
		throw error;
	}
};

// create
export const createManager = async (data, campus_id) => {
	try {
		const { error } = validateManagerDataCreate(data);

		if (error) throw createHttpError(400, 'Dữ liệu không hợp lệ: ' + error.message);

		const duplicate = await ManagerModel.findOne({ email: data.email, campus_id }); // check tồn tại

		if (duplicate) throw createHttpError(409, 'Manager đã tồn tại vui lòng kiểm tra lại');

		const result = await new ManagerModel({ ...data, campus_id }).save();

		return result;
	} catch (error) {
		throw error;
	}
};

// update
export const updateManager = async (_id, data, campus_id) => {
	try {
		const { error } = validateManagerDataUpdate(data);

		if (error) throw createHttpError(400, 'Dữ liệu không hợp lệ: ' + error.message);
		await getOneManager(id, campus_id); // check tồn tại

		const filter = { _id, campus_id };
		const options = { new: true };
		const result = await ManagerModel.findOneAndUpdate(filter, data, options);

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
			campus_id: campus
		});

		return result;
	} catch (error) {
		throw error;
	}
};
