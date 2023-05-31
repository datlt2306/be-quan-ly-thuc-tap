import ConfigTime from '../models/timeWindow.model';
import { getCurrentSemester } from '../services/semester.service';
import moment from 'moment';

export const checkRequestTime = async (req, res, next) => {
	const { typeNumber } = req.body;
	const campus = req.campusManager || req.campusStudent;

	try {
		const semester = await getCurrentSemester(campus);

		if (!semester || !campus) throw new Error('Bạn không có quyền truy cập vào chức năng này');

		const timeWindow = await ConfigTime.findOne({
			typeNumber,
			semester_id: semester._id,
			campus_id: campus
		});

		if (!timeWindow) return res.status(400).json('Không tìm thấy thời gian đăng ký');

		const dateNow = moment();
		const startTime = moment(timeWindow.startTime);
		const endTime = moment(timeWindow.endTime);

		// Kiểm tra nếu trong thời gian đăng ký sẽ cho phép tiếp tục
		const isWithinTimeWindow = dateNow.isAfter(startTime) && dateNow.isBefore(endTime);

		if (isWithinTimeWindow) {
			next();
		} else {
			return res.status(400).json({
				message: 'Hết thời gian nộp form'
			});
		}
	} catch (error) {
		return res.status(400).json(error.message || 'Lỗi');
	}
};
