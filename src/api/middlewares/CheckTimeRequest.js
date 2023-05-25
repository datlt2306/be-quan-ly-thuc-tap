import ConfigTime from '../models/timeWindow.model';
import { getCurrentSemester } from '../controllers/semester_id.controller';
import moment from 'moment';
import student from '../models/student.model';

export const checkRequestTime = async (req, res, next) => {
	const { typeNumber } = req.body;
	const campus_id = req.campusStudent;
	const student_id = req.student_id;

	try {
		const { _id: semester_id } = await getCurrentSemester(campus_id);

		if (!semester_id || !campus_id) throw createHttpError(403, 'Bạn không có quyền truy cập vào chức năng này');

		// Sửa CV, Biên bản, Báo Cáo sẽ đc bỏ qua thời gian đăng ký
		const byPass = await student.findOne({ semester_id, campus_id, student_id, statusCheck: { $in: [1, 5, 8] } });
		const timeWindow = await ConfigTime.findOne({
			typeNumber,
			semester_id: semester_id,
			campus_id: campus_id
		});

		if (!timeWindow) throw createHttpError(404, 'Không tìm thấy thời gian đăng ký');

		const dateNow = moment();
		const startTime = moment(timeWindow.startTime);
		const endTime = moment(timeWindow.endTime);

		// Kiểm tra nếu trong thời gian đăng ký sẽ cho phép tiếp tục
		const isWithinTimeWindow = dateNow.isAfter(startTime) && dateNow.isBefore(endTime);

		if (byPass || isWithinTimeWindow) {
			next();
		} else {
			throw createHttpError(401, 'Hết thời gian nộp form');
		}
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};
