import * as majorServices from '../services/majors.service';

// [GET] /api/major
export const getListMajor = async (req, res) => {
	try {
		const campus = req.campusManager || req.campusStudent;

		const result = await majorServices.getAllMajors(campus);

		return res.status(200).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

// [GET] /api/major/:id
export const getMajor = async (req, res) => {
	try {
		const id = req.params.id;
		const campus = req.campusManager || req.campusStudent;

		const major = await majorServices.getOneMajor(id, campus);

		return res.status(200).json(major);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

// [POST] /api/major
export const createMajor = async (req, res) => {
	try {
		const data = req.body;
		const campus = req.campusManager;

		let result = null;

		if (Array.isArray(data)) {
			result = await majorServices.createMajorList(data, campus);
		} else {
			result = await majorServices.createOneMajor(data, campus);
		}

		return res.status(201).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
			error: error.error,
		});
	}
};

// [PATCH] /api/major/:id
export const updateMajor = async (req, res) => {
	try {
		const data = req.body;
		const id = req.params.id;
		const campus = req.campusManager;

		const result = await majorServices.updateMajor(id, data, campus);

		return res.status(201).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

// [DELETE] /api/major/:id
export const removeMajor = async (req, res) => {
	try {
		const id = req.params.id;
		const campus = req.campusManager;

		const result = await majorServices.deleteMajor(id, campus);

		return res.status(200).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};
