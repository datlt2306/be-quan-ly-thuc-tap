import ConfigTime from '../models/configTime.model';
import { getCurrentSemester } from '../controllers/semester.controller';

export const checkRequestTime = async (req, res, next) => {
	const { typeNumber, checkTime = true } = req.body;
	const campus = req.campusManager || req.campusStudent;

	try {
		const semester = await getCurrentSemester(campus);
		const dateNow = Date.now();

		if (!semester || !campus) throw new Error('Bạn không có quyền truy cập vào chức năng này');

		const timeWindow = await ConfigTime.findOne({
			typeNumber,
			semester_id: semester._id,
			campus_id: campus,
		});

		if (!timeWindow) throw new Error('Không tìm thấy thời gian đăng ký');

		const { startTime, endTime } = timeWindow;
		if (checkTime) {
			next();
		} else if (dateNow > startTime && dateNow < endTime && !checkTime) {
			next();
		} else {
			return res.status(400).json({
				message: 'Hết thời gian nộp form',
			});
		}
	} catch (error) {
		return res.status(400).json(error.message || 'Lỗi');
	}
};
