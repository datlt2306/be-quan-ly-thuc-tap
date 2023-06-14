import Semester from '../models/semester.model';
import { HttpException } from '../../utils/httpException';
import createHttpError from 'http-errors';
import { semesterValidation } from '../validation/semester.validation';
import { isValidObjectId } from 'mongoose';
import { checkValidSemesterTime, getDefaultSemester } from '../services/semester.service';

export const getSemester = async (req, res) => {
	const campus_id = req?.query?.campus_id;
	const currentDate = new Date();

	try {
		if (!campus_id) throw createHttpError(400, 'Cần truyền vào campus_id');

		const semesters = await Semester.find({ campus_id }).sort({ start_time: -1 });
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

		const isValidSemesterTimeRange = await checkValidSemesterTime({ ...value, id });
		if (isValidSemesterTimeRange === false) {
			throw createHttpError.Conflict(
				'Thời gian bắt đầu của kỳ hiện tại phải lớn hơn thời gian kết thúc của kỳ trước'
			);
		}

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

		const isValidSemesterStartTime = await checkValidSemesterTime(value);
		if (isValidSemesterStartTime === false) {
			throw createHttpError.Conflict(
				'Thời gian bắt đầu của kỳ hiện tại phải lớn hơn thời gian kết thúc của kỳ trước'
			);
		}
		const result = await new Semester(value).save();

		return res.status(200).json(result);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

export const defaultSemester = async (req, res) => {
	try {
		const { campus_id } = req.query;
		const result = await getDefaultSemester(campus_id);

		if (!result) throw createHttpError(404, 'Không tìm thấy kỳ học');
		return res.status(200).json(result);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};
