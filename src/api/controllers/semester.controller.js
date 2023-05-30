import Semester from '../models/semester.model';
import { HttpException } from '../../utils/httpException';
import createHttpError from 'http-errors';
import { semesterValidation } from '../validation/semester.validation';
import { isValidObjectId } from 'mongoose';

//* CONSTANT
export const SEMESTER_NAME = ['spring', 'summer', 'fall'];

export const getSemester = async (req, res) => {
	const { campus_id } = req.query;
	const currentDate = new Date();

	try {
		if (!campus_id) throw createHttpError(400, 'Cần truyền vào campus_id');

		const semesters = await Semester.find({ campus_id }).sort({ createdAt: -1 });
		const defaultSemester = await Semester.findOne({
			$and: [{ start_time: { $lte: currentDate } }, { end_time: { $gte: currentDate } }],
			campus_id
		});

		return res.status(200).json({ defaultSemester, listSemesters: semesters });
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

export const getDefaultSemester = async (req, res) => {
	const { campus_id } = req.query;

	try {
		if (!campus_id) throw createHttpError(400, 'Cần truyền vào campus_id');

		const result = await Semester.findOne({
			$and: [{ start_time: { $lte: new Date() } }, { end_time: { $gte: new Date() } }],
			campus_id
		});

		return res.status(200).json(result);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

export const updateSemester = async (req, res) => {
	const { name, campus_id, start_time, end_time } = req.body;
	const { id } = req.params;

	try {
		const cleanedName = name.toLowerCase().trim();
		const isExist = await Semester.findById(id);

		const { error, value } = semesterValidation({
			name: cleanedName,
			campus_id,
			start_time,
			end_time
		});

		if (!isExist) throw createHttpError(404, 'Kỳ học không tồn tại, vui lòng thử lại');
		if (error) throw createHttpError(400, 'Dữ liệu không hợp lệ: ' + error.message);
		if (!isValidObjectId(id)) throw createHttpError(400, 'ID không hợp lệ');

		await isStartDateValid({ ...req.body, id }); // Tìm kỳ học gần nhât theo end_time
		const result = await Semester.findByIdAndUpdate(id, value);

		return res.status(200).json(result);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

export const insertSemester = async (req, res) => {
	const { name, campus_id, start_time, end_time } = req.body;

	try {
		const cleanedName = name.toLowerCase().trim();
		const findName = await Semester.findOne({ name: cleanedName, campus_id });
		const { error, value } = semesterValidation({ name: cleanedName, campus_id, start_time, end_time });

		if (findName) throw createHttpError(400, 'Tên kỳ đã tồn tại, vui lòng đặt tên khác!');
		if (error) throw createHttpError(400, 'Dữ liệu không hợp lệ: ' + error.message);

		await isStartDateValid(value); // Tìm kỳ học gần nhât theo end_time
		const result = await new Semester(value).save();

		return res.status(200).json(result);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

//! NOT A CONTROLLER
export const getCurrentSemester = async (campus) => {
	try {
		const dataDefault = await Semester.findOne({
			$and: [{ start_time: { $lte: new Date() } }, { end_time: { $gte: new Date() } }],
			campus_id: campus
		});

		return dataDefault;
	} catch (error) {
		throw error;
	}
};

async function isStartDateValid(data) {
	try {
		const closestSemester = await Semester.findOne({
			name: { $ne: data.name.toLowerCase().trim() },
			end_time: { $gte: data.start_time },
			campus_id: data.campus_id
		}).sort({ end_time: 1 });

		if (closestSemester) {
			throw createHttpError(
				400,
				`Thời gian bắt đầu phải lớn hơn thời gian kết thúc của kỳ trước: Kỳ ${closestSemester.name} ${convertDate(
					closestSemester.end_time
				)}`
			);
		}
	} catch (error) {
		throw error;
	}
}

function convertDate(date) {
	return new Intl.DateTimeFormat('vi-VN', {
		year: 'numeric',
		month: 'long',
		day: '2-digit'
	}).format(date);
}
