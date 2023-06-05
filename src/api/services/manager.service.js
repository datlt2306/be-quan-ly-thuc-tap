import createHttpError from 'http-errors';
import ManagerModel from '../models/manager.model';
import { validateManagerDataCreate, validateManagerDataUpdate } from '../validation/manager.validation';

// get list
export const getListManager = async (limit, page, ...query) => {
	const options = {
		page: +page || 1,
		limit: +limit || 10,
		populate: ['campus_id'],
		customLabels: {
			limit: 'pageSize',
			docs: 'data'
		}
	};
	const filter = Object.assign({}, ...query);

	try {
		return await ManagerModel.paginate(filter, options);
	} catch (error) {
		throw new Error(error.message || 'Lỗi');
	}
};

// get one
export const getOneManager = async (id, ...query) => {
	try {
		let filter = Object.assign({ _id: id }, ...query);
		let result = await ManagerModel.findOne(filter).populate('campus_id').exec();

		if (!result) throw createHttpError(404, 'Không tìm thấy cơ sở của tài khoản');
		return result;
	} catch (error) {
		throw error;
	}
};

// create
export const createManager = async (data, campus) => {
	try {
		const { error } = validateManagerDataCreate(data);

		if (error) throw createHttpError(400, 'Dữ liệu không hợp lệ: ' + error.message);

		const duplicate = await ManagerModel.findOne({ email: data.email, campus_id: data.campus_id }); // check tồn tại

		if (duplicate) throw createHttpError(409, 'Manager đã tồn tại vui lòng kiểm tra lại');

		const result = await new ManagerModel({ ...data, campus_id: campus }).save();
		return result;
	} catch (error) {
		throw error;
	}
};

// update
export const updateManager = async (_id, data) => {
	try {
		const { error } = validateManagerDataUpdate(data);

		if (error) throw createHttpError(400, 'Dữ liệu không hợp lệ: ' + error.message);

		await getOneManager(_id); // check tồn tại
		const filter = { _id };
		const result = await ManagerModel.findOneAndUpdate(filter, data, { new: true });

		return result;
	} catch (error) {
		throw error;
	}
};

// delete
export const deleteManager = async (id) => {
	try {
		await getOneManager(id); // check tồn tại
		const result = await ManagerModel.findByIdAndDelete(id);

		return result;
	} catch (error) {
		throw error;
	}
};
