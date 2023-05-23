import * as ManagerServices from '../services/manager.service';

// [GET] /api/manager
export const getListManager = async (req, res) => {
	try {
		const campus = req.campusManager;
		const result = await ManagerServices.getListManager(campus, req.query.limit, req.query.page);

		return res.status(200).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

// [GET] /api/manager/:id
export const getManager = async (req, res) => {
	try {
		const campus = req.campusManager;
		const id = req.params.id;

		const result = await ManagerServices.getOneManager(id, campus);

		return res.status(200).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
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
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

// [PATCH] /api/manager/:id
export const updateManager = async (req, res) => {
	const campus = req.campusManager;
	const data = req.body;
	const id = req.params.id;
	try {
		const result = await ManagerServices.updateManager(id, data, campus);

		return res.status(201).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
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
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};
