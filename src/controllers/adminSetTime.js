import * as configTimeServices from '../services/configTime.service';

// [POST] /api/settime
export const handleSetTimeRequest = async (req, res) => {
	const data = req.body;
	const campus = req.campusManager;
	try {
		const result = await configTimeServices.createConfigTime(data, campus);

		return res.status(201).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

// [GET] /api/settime
export const getListTypeSetTime = async (req, res) => {
	const campus = req.campusManager || req.campusStudent;
	try {
		const result = await configTimeServices.getListConfigTime(campus);

		return res.status(200).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

// [GET] /api/settime/:id
export const getOneTypeSetTime = async (req, res) => {
	const campus = req.campusManager || req.campusStudent;
	const id = req.params.id;
	try {
		const result = await configTimeServices.getOneConfigTime(id, campus);

		return res.status(200).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

// [PATCH] /api/settime/:id
export const updateSetTime = async (req, res) => {
	const campus = req.campusManager;
	const id = req.params.id;
	const data = req.body;
	try {
		const result = await configTimeServices.updateConfigTime(id, data, campus);

		return res.status(201).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

// [DELETE] /api/settime/:id
export const deleteSetTime = async (req, res) => {
	const campus = req.campusManager;
	const id = req.params.id;
	try {
		const result = await configTimeServices.deleteConfigTime(id, campus);

		return res.status(200).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};
