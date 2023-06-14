import * as statusStudentService from '../services/statusStudent.service';

// [GET] /api/statusStudent
export const getStatusStudent = async (req, res) => {
	const campus = req.campusManager || req.campusStudent;
	try {
		const result = await statusStudentService.selectStatusAll(campus);

		return res.status(200).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error'
		});
	}
};

// [POST] /api/statusStudent/:id
export const createStatusStudent = async (req, res) => {
	const campus = req.campusManager || req.campusStudent;
	const data = req.body;
	try {
		const result = await statusStudentService.createStatus(campus, data);

		return res.status(201).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error'
		});
	}
};

// [PATCH] /api/statusStudent/:id
export const updateStatusStudent = async (req, res) => {
	const campus = req.campusManager || req.campusStudent;
	const data = req.body;
	const id = req.params.id;
	try {
		const result = await statusStudentService.updateStatus(id, data, campus);

		return res.status(201).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error'
		});
	}
};

// [DELETE] /api/statusStudent/:id
export const deleteStatusStudent = async (req, res) => {
	const campus = req.campusManager || req.campusStudent;
	const id = req.params.id;
	try {
		const result = await statusStudentService.deleteStatus(id, campus);

		return res.status(200).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error'
		});
	}
};
