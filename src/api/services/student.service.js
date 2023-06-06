import createHttpError from 'http-errors';
import { StudentReviewTypeEnum } from '../constants/reviewTypeEnum';
import StudentModel from '../models/student.model';
import { getCurrentSemester } from './semester.service';

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
		data = data.map((student) => ({
			...student,
			email: student.email.toLowerCase(),
			mssv: student.mssv.toUpperCase()
		}));
		/**
		 * * Lấy ra các list sinh viên bao gồm:
		 * 	-> List sinh viên kỳ hiện tại
		 * 	-> List sinh viên không đủ điều kiện từ trước đến nay
		 */
		const [instanceStudentsList, qualifiedStudents] = await Promise.all([
			StudentModel.find({
				smester_id: semesterId,
				campus_id: campusId
			}),
			StudentModel.find({
				campus_id: campusId,
				statusCheck: { $in: [3, 12] },
				email: { $in: data.map((student) => student.email) }
			})
		]);
		const isFirstStage = !instanceStudentsList.length;
		const isSecondStage = instanceStudentsList.every((student) => student.updatedInStage === 1);

		/* PROVISONAL STAGE */
		if (isFirstStage) {
			// Các sinh viên mới ngoại trừ sinh viên đã trượt từ các kỳ trước nay đã có trong danh sách
			const newExpectedStudents = await Promise.all([
				addOrUpdateStudents(data.map((std) => ({ ...std, updatedInStage: 1 }))),
				StudentModel.updateMany(
					{ _id: { $in: qualifiedStudents } },
					{ $set: { smester_id: semesterId, updatedInStage: 1, statusCheck: 10 } },
					{ new: true, multi: true }
				)
			]);

			return newExpectedStudents;
		}

		/* CASE STAGE 2 */
		if (isSecondStage) {
			// Danh sách sinh viên không đủ điều kiện trong đợt 2
			const excludeStudents = instanceStudentsList.filter(
				(student) => !data.some((std) => std.email === student.email)
			);

			return await Promise.all([
				addOrUpdateStudents(data),
				StudentModel.bulkWrite([
					{
						updateMany: {
							filter: { _id: { $in: excludeStudents } },
							update: { $set: { statusCheck: 3 } }
						}
					},
					{
						updateMany: {
							filter: { _id: { $in: qualifiedStudents } },
							update: { $set: { smester_id: semesterId, statusCheck: 10 } }
						}
					},
					{
						updateMany: {
							filter: {
								smester_id: semesterId,
								campus_id: campusId
							},
							update: { $set: { updatedInStage: 2 } }
						}
					}
				])
			]);
		}

		/* CASE ADDITIONAL STAGE  */
		return await Promise.all([
			addOrUpdateStudents(data),
			StudentModel.bulkWrite([
				{
					updateMany: {
						filter: { _id: { $in: qualifiedStudents } },
						update: { $set: { semester_id: semesterId, statusCheck: 10 } }
					}
				},
				{
					updateMany: {
						filter: { semester_id: semesterId, campus_id: campusId },
						update: { $set: { updatedInStage: 3 } }
					}
				}
			])
		]);
	} catch (error) {
		throw error;
	}
};

// Add or create students
const addOrUpdateStudents = async (students) => {
	try {
		const bulkOperations = students.map((student) => ({
			updateOne: {
				filter: { $or: [{ email: student.email }, { mssv: student.mssv }] },
				update: student,
				upsert: true
			}
		}));

		return await StudentModel.bulkWrite(bulkOperations);
	} catch (error) {
		throw error;
	}
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
		console.log('error :>> ', error);
		throw error;
	}
};
