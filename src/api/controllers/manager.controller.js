import * as ManagerServices from '../services/manager.service';
import { HttpException } from '../../utils/httpException';
import createHttpError from 'http-errors';
import { role } from '../../utils/role';
// [GET] /api/manager/:id
export const getManager = async (req, res) => {
	try {
		const campus_id = req.campusManager;
		const id = req.params.id;

		const result = await ManagerServices.getOneManager(id, { campus_id });

		return res.status(200).json(result);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

// [POST] /api/manager
export const createManager = async (req, res) => {
	const campus = req.campusManager;
	const data = req.body;
	try {
		const result = await ManagerServices.createManager(data, campus);

		return res.status(201).json(result);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

// [PATCH] /api/manager/:id
export const updateManager = async (req, res) => {
	const data = req.body;
	const campus = req.campusManager;
	const id = req.params.id;

	try {
		if (!campus) throw createHttpError(400, 'Không tìm thấy cơ sở');
		const result = await ManagerServices.updateManager(id, data, campus);

		return res.status(201).json(result);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

// [DELETE] /api/manager/:id
export const removeManager = async (req, res) => {
	try {
		const campus = req.campusManager;
		const id = req.params.id;

		const result = await ManagerServices.deleteManager(id, campus);

		return res.status(200).json(result);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

// [GET] /api/manager (By Campus)
export const getListManager = async (req, res) => {
	try {
		const { limit, page } = req.query;
		const campus_id = req.campusManager;

		if (!campus_id) throw createHttpError(400, 'Không tìm thấy cơ sở');

		const result = await ManagerServices.getListManager(limit, page, { campus_id });

		return res.status(200).json(result);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

// [GET] /api/admin/manager (By Role)
export const permittedListManager = async (req, res) => {
	try {
		// Double check admin permission
		if (!req.bypass) throw createHttpError(400, 'Không có quyền cho thao tác này');
		console.log('manager campus:>>>>', req.campusManager);
		const { limit, page } = req.query;
		const result = await ManagerServices.getListManager(limit, page, { role: role.manager });

		return res.status(200).json(result);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

// [POST] /api/admin/manager
export const permittedCreateManager = async (req, res) => {
	try {
		const data = req.body;
		data.role = role.manager;
		// Double check admin permission
		if (!req.bypass) throw createHttpError(400, 'Không có quyền cho thao tác này');
		if (!data.campus_id) throw createHttpError(400, 'Không tìm thấy cơ sở');

		const result = await ManagerServices.createManager(data);
		return res.status(201).json(result);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

// [PATCH] /api/admin/manager/:id
export const permittedUpdateManager = async (req, res) => {
	const data = req.body;
	const id = req.params.id;
	data.role = role.manager;

	try {
		const result = await ManagerServices.updateManager(id, data);
		return res.status(201).json(result);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};
