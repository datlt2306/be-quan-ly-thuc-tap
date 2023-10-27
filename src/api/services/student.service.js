import createHttpError from 'http-errors';
import { StudentReviewTypeEnum } from '../constants/reviewTypeEnum';
import StudentModel from '../models/student.model';
import { getCurrentSemester } from './semester.service';
import { StudentStatusCodeEnum } from '../constants/studentStatus';

export const checkStudentExist = async (id, campus) => {
	try {
		const semester = await getCurrentSemester(campus);

		// kiêm tra xem student có tồn tại không
		const student = await StudentModel.findOne({
			_id: id,
			campus_id: campus,
			smester_id: semester._id
		});

		if (!student) {
			throw createHttpError(404, 'Học sinh không tồn tại!');
		}

		return student;
	} catch (error) {
		throw error;
	}
};

// thêm sinh viên thực tập thực tập
export const createListStudent = async ({ semesterId, campusId, data }) => {
	try {
		/**
		 * * Lấy ra các list sinh viên bao gồm:
		 * 	-> List sinh viên kỳ hiện tại
		 * 	-> List sinh viên không đủ điều kiện từ trước đến nay nhung co trong danh sach tai len
		 */
		const [instanceStudentsList, qualifiedStudents] = await Promise.all([
			StudentModel.find({
				smester_id: semesterId,
				campus_id: campusId
			}),
			StudentModel.find({
				campus_id: campusId,
				statusCheck: { $in: [StudentStatusCodeEnum.NOT_QUALIFIED, StudentStatusCodeEnum.NOT_PASS] },
				email: { $in: data.map((student) => student.email) }
			})
		]);

		const excludeStudents = instanceStudentsList.filter(
			(student) =>
				!data.some((std) => std.email === student.email) &&
				[StudentStatusCodeEnum.NOT_REGISTERED, StudentStatusCodeEnum.NOT_QUALIFIED].includes(+student.statusCheck)
		);

		return await Promise.all([
			upsertStudents(data),
			StudentModel.bulkWrite(
				[
					{
						updateMany: {
							filter: { _id: { $in: excludeStudents } },
							update: { $set: { statusCheck: StudentStatusCodeEnum.NOT_QUALIFIED } }
						}
					},
					{
						updateMany: {
							filter: { _id: { $in: qualifiedStudents } },
							update: { $set: { smester_id: semesterId, statusCheck: StudentStatusCodeEnum.NOT_REGISTERED } }
						}
					}
				],
				{ ordered: false }
			)
		]);
	} catch (error) {
		throw createHttpError.InternalServerError(error.message);
	}
};

// Add or create students
const upsertStudents = async (students) => {
	const bulkOperations = students.map((student) => ({
		updateOne: {
			filter: { $or: [{ email: student.email }, { mssv: student.mssv }] },
			update: student,
			upsert: true
		}
	}));

	return await StudentModel.bulkWrite(bulkOperations, { ordered: false });
};

export const getStudentsToReview = async ({ reviewType, campus, semester }) => {
	try {
		switch (reviewType) {
			case StudentReviewTypeEnum.REVIEW_CV:
				return await StudentModel.find({
					CV: { $ne: null },
					statusCheck: { $in: [0, 1] },
					campus_id: campus,
					smester_id: semester
				});
			case StudentReviewTypeEnum.REVIEW_RECORD:
				return await StudentModel.find({
					statusCheck: { $in: [4, 5] },
					form: { $ne: null },
					smester_id: semester,
					campus_id: campus
				});
			case StudentReviewTypeEnum.REVIEW_REPORT:
				return await StudentModel.find({
					statusCheck: { $in: [7, 8] },
					form: { $ne: null },
					report: { $ne: null },
					smester_id: semester,
					campus_id: campus
				});
			default:
				return [];
		}
	} catch (error) {
		throw error;
	}
};
