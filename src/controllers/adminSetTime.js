import * as configTimeServices from '../services/configTime.service';
import ConfigTime from '../models/configTime';
import { getCurrentSemester } from './semesterController';
import { validateConfigTimeCreateData } from '../validation/configTime.validation';
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
		const campus = req.campusManager;
		const semester = await getCurrentSemester(campus);

		if (!campus) throw new Error('Campus not found');
		if (!semester) throw new Error('Semester not found');

		const time = await ConfigTime.find({ semester_id: semester._id, campus_id: campus });
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
	try {
		const { typeNumber } = req.params;
		const campus = req.campusManager;
		const semester = await getCurrentSemester(campus);

		if (!campus) throw new Error('Campus not found');
		if (!semester) throw new Error('Semester not found');

		const timeWindow = await ConfigTime.findOne({
			typeNumber,
			semester_id: semester._id,
			campus_id: campus,
		})
			.sort({ startTime: -1, endTime: -1 })
			.exec();

		if (!timeWindow) throw new Error('Time window not found');

		return res.status(200).json({
			message: 'Time window retrieved successfully',
			time: timeWindow,
		});
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

export const getTimeWindowByID = async (req, res) => {
	try {
		const { id } = req.params;
		const timeWindow = await ConfigTime.findOne({
			_id: id,
		});

		if (!timeWindow) throw new Error('Time window not found');

		return res.status(200).json({
			message: 'Time window retrieved successfully',
			time: timeWindow,
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
