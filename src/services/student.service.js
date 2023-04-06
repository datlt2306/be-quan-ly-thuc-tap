import createHttpError from 'http-errors';
import { getCurrentSemester } from '../controllers/semesterController';
import StudentModel from '../models/student';

// check xem học sinh có tồn tại ở cơ sở và kỳ hiện tại không
export const checkStudentExist = async (id, campus) => {
	try {
		const semester = await getCurrentSemester(campus);

		// kiêm tra xem student có tồn tại không
		const student = await StudentModel.findOne({
			_id: id,
			campus_id: campus,
			smester_id: semester._id,
		});

		if (!student) {
			throw createHttpError(404, 'Học sinh không tồn tại!');
		}

		return student;
	} catch (error) {
		throw error;
	}
};
