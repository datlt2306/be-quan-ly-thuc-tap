import createHttpError from 'http-errors';
import Semester from '../models/semester.model';
import _ from 'lodash';

export const checkValidSemesterTime = async (data) => {
	try {
		const semestersByCampus = await Semester.find({ campus_id: data.campus_id }).sort({ end_time: 1 });
		if (semestersByCampus.length === 0) return true;
		const currentSemesterIndex = semestersByCampus.findIndex((semester) => semester._id.toString() == data.id);
		const currentSemesterStartTime = new Date(data.start_time).getTime();
		const currentSemesterEndTime = new Date(data.end_time).getTime();
		switch (currentSemesterIndex) {
			case -1: // thêm mới
				return currentSemesterStartTime > new Date(semestersByCampus[0]?.end_time);
			case 0:
				return semestersByCampus
					.slice(1)
					.every((semester) => new Date(semester.start_time).getTime() > currentSemesterEndTime);
			case semestersByCampus.length - 1:
				return currentSemesterStartTime > new Date(semestersByCampus[1].end_time).getTime();
			default:
				const previousSemesterEndTime = new Date(semestersByCampus[currentSemesterIndex - 1]?.end_time).getTime();
				const nextSemesterStartTime = new Date(semestersByCampus[currentSemesterIndex + 1]?.start_time).getTime();
				return currentSemesterStartTime > previousSemesterEndTime && currentSemesterEndTime < nextSemesterStartTime;
		}
	} catch (error) {
		throw error;
	}
};

export const getDefaultSemester = async (campus_id) => {
	try {
		if (!campus_id) throw createHttpError(400, 'Cần truyền vào campus_id');

		const result = await Semester.findOne({
			$and: [{ start_time: { $lte: new Date() } }, { end_time: { $gte: new Date() } }],
			campus_id
		});
		return result;
	} catch (error) {
		throw error;
	}
};

export const getCurrentSemester = async (campus_id) => {
	try {
		if (!campus_id) throw createHttpError(400, 'Cần truyền vào campus_id');

		const dataDefault = await Semester.findOne({
			$and: [{ start_time: { $lte: new Date() } }, { end_time: { $gte: new Date() } }],
			campus_id
		});

		return dataDefault;
	} catch (error) {
		throw error;
	}
};
