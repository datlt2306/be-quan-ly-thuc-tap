import createHttpError from 'http-errors';
import { replaceContentMail } from '../../utils/toolkit';
import { StudentReviewTypeEnum } from '../constants/reviewTypeEnum';
import { transporter } from '../controllers/email.controller';
import { getCurrentSemester } from './semester.service';
import StudentModel from '../models/student.model';
import { validateUpdateStatus } from '../validation/student.validation';
import { selectOneStatus } from './statusStudent.service';
require('dotenv').config();
const apiKey = 'cc126cffe46824f121e00226099067e3-us21';

// check xem học sinh có tồn tại ở cơ sở và kỳ hiện tại không
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
		data = data.map((student) => ({ ...student, mssv: student.mssv.toUpperCase() }));
		// Lây ra danh sách sinh viên trong kỳ hiện tại & sinh viên đã trượt/không đủ điều kiện + những sinh viên đã tồn tại
		const [existedStudents, instanceStudentsList, notQualifiedStudentForAllTime] = await Promise.all([
			StudentModel.find({ email: { $in: data.map((student) => student.email) } }),
			StudentModel.find({
				smester_id: semesterId,
				campus_id: campusId
			}),
			StudentModel.find({
				campus_id: campusId,
				statusCheck: { $in: [3, 12] }
			})
		]);
		const isFirstStage = !instanceStudentsList.length;
		const isSecondStage = instanceStudentsList.every((student) => student.updatedInStage === 1);

		const newStudents = data.filter((student) => !instanceStudentsList.some((std) => std.mssv === student.mssv));
		// Các sinh viên không đủ điều kiện từ kỳ trước nay có trong danh sách dự kiến ở kỳ hiện tại
		const qualifiedStudents = notQualifiedStudentForAllTime.filter((student) =>
			newStudents.some((std) => std.mssv === student.mssv)
		);

		if (isFirstStage) {
			/* CASE STAGE 1 */
			if (existedStudents.length) {
				throw createHttpError.Conflict('Some students already existed!');
			}
			// Các sinh viên mới ngoại trừ sinh viên đã trượt từ các kỳ trước nay đã có trong danh sách
			const newStudentsInFirstStage = newStudents
				.map((student) => ({
					...student,
					updatedInStage: 1
				}))
				.filter((student) => !qualifiedStudents.some((std) => std.mssv === student.mssv));
			const newExpectedStudents = await Promise.all([
				StudentModel.insertMany(newStudentsInFirstStage),
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
			const excludeStudentsInSecondStage = instanceStudentsList.filter(
				(student) => !data.some((std) => std.mssv.toUpperCase() === student.mssv.toUpperCase())
			);
			console.log(excludeStudentsInSecondStage);
			const newStudentsInSecondStage = newStudents.filter(
				(student) => !qualifiedStudents.some((std) => std.mssv === student.mssv)
			);
			const resultOfUpdateAtStage2 = await Promise.all([
				StudentModel.insertMany(newStudentsInSecondStage),
				StudentModel.updateMany({ _id: { $in: excludeStudentsInSecondStage } }, { $set: { statusCheck: 3 } }),
				StudentModel.updateMany(
					{ _id: { $in: qualifiedStudents } },
					{ $set: { smester_id: semesterId, statusCheck: 10 } },
					{ new: true, multi: true }
				),
				StudentModel.updateMany(
					{
						smester_id: semesterId,
						campus_id: campusId
					},
					{ $set: { updatedInStage: 2 } },
					{ multi: true, new: true }
				)
			]);

			return resultOfUpdateAtStage2;
		}

		/* CASE ADDITIONAL STAGE  */
		// Sinh viên không đủ điều kiện trong đợt 2 nhưng có trong đợt bổ sung
		const exclude_in_2nd_stage_and_include_in_additional_stage = instanceStudentsList
			.filter((student) => data.some((std) => std.mssv === student.mssv))
			.filter((student) => student.statusCheck === 3);
		const newStudentInAdditionalStage = newStudents.filter(
			(student) => !qualifiedStudents.some((std) => std.mssv === student.mssv)
		);
		const resultOfUpdateAtAdditionalStage = await Promise.all([
			StudentModel.insertMany(newStudentInAdditionalStage),
			StudentModel.updateMany(
				{ _id: { $in: exclude_in_2nd_stage_and_include_in_additional_stage } },
				{ $set: { statusCheck: 10 } }
			),
			StudentModel.updateMany(
				{ _id: { $in: qualifiedStudents } },
				{ $set: { smester_id: semesterId, statusCheck: 10 } },
				{ new: true, multi: true }
			),
			StudentModel.updateMany(
				{
					smester_id: semesterId,
					campus_id: campusId
				},
				{ $set: { updatedInStage: 3 } },
				{ multi: true, new: true }
			)
		]);
		return resultOfUpdateAtAdditionalStage;
	} catch (error) {
		throw error;
	}
};

// thay đổi trạng thái sinh viên
export const updateStatusStudent = async (data, hostname, campus) => {
	try {
		const { listIdStudent, status: statusValue, textNote } = data;
		if (!Array.isArray(listIdStudent)) {
			throw createHttpError(400, 'listIdStudent type phải là array');
		}
		if (listIdStudent.length === 0) {
			throw createHttpError(204);
		}

		// validate
		const { error } = validateUpdateStatus(data);
		if (error) {
			throw createHttpError(400, error.message);
		}

		// check statusValue đã được tạo ra chưa
		const statusStudent = await selectOneStatus(statusValue, campus);

		if (!statusStudent) {
			throw createHttpError(404, 'Trạng thái không tồn tại');
		}
		const semester = await getCurrentSemester(campus);
		// check xem các học sinh có tồn tại ở cơ sở không
		const studentNotExist = [];
		const checkStudentListExist = await StudentModel.find({
			_id: { $in: listIdStudent },
			campus_id: campus,
			smester_id: semester._id
		}).lean();

		if (checkStudentListExist.length < listIdStudent.length) {
			listIdStudent.forEach((idStudent) => {
				let check = checkStudentListExist.find((student) => student._id.toString() === idStudent.toString());
				if (!check) {
					studentNotExist.push(idStudent);
				}
			});

			throw createHttpError(404, 'Sinh viên không tồn tại', { error: studentNotExist });
		}

		// thay đổi trạng thái của student
		await StudentModel.updateMany(
			{
				_id: { $in: listIdStudent },
				campus_id: campus
			},
			{
				statusCheck: statusValue,
				note: textNote
			},
			{
				multi: true
			}
		);

		// gửi mail thông báo
		let content = replaceContentMail(statusStudent.contentMail, {
			hostname,
			note: textNote,
			statusTitle: statusStudent.title
		});
		const listEmailStudent = checkStudentListExist.map((student) => student.email);

		await transporter.sendMail({
			from: '"Phòng QHDN" <' + process.env.USER_EMAIL + '>',
			to: listEmailStudent,
			html: content,
			subject: statusStudent.titleMail
		});

		return {
			message: 'Thay đổi trạng thái sinh viên thành công'
		};
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
