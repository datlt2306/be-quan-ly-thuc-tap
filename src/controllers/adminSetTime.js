import * as configTimeServices from '../services/configTime.service';
import ConfigTime from '../models/configTime';
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
	try {
		const { semester_id, campus_id } = req.query;
		const time = await ConfigTime.find({ semester_id, campus_id });
		return res.status(200).json({
			message: 'time success',
			time: time,
		});
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

export const getOneTypeSetTime = async (req, res) => {
	const { typeNumber, semester_id, campus_id } = req.query;
	try {
		const time = await ConfigTime.findOne({ typeNumber, semester_id, campus_id });
		return res.status(200).json({
			message: 'time success',
			time: time,
		});
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
