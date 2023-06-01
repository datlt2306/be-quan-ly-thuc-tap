import createHttpError from 'http-errors';
import { getMailTemplate } from '../../utils/emailTemplate';
import { HttpException } from '../../utils/httpException';
import HttpStatusCode from '../constants/httpStatusCode';
import { StudentReviewTypeEnum } from '../constants/reviewTypeEnum';
import BusinessModel from '../models/business.model';
import SemesterModel from '../models/semester.model';
import StudentModel from '../models/student.model';
import { sendMail } from '../services/mail.service';
import * as StudentService from '../services/student.service';
import { checkStudentExist } from '../services/student.service';
import { validateDataCreateStudentList } from '../validation/student.validation';
import { getCurrentSemester } from '../services/semester.service';

// [GET] /api/student?limit=20&page=1
export const listStudent = async (req, res) => {
	const semester = req.query.semester;
	// campusManager được thêm từ middleware
	const campusManager = req.campusManager;
	try {
		// xác định học kỳ hiện tại
		const dataDefault = await SemesterModel.findOne({
			$and: [{ start_time: { $lte: new Date() } }, { end_time: { $gte: new Date() } }],
			campus_id: campusManager
		});
		// lấy ra các học sinh thỏa mãn đăng ký kỳ hiện tại và thuộc cơ sở của manger đăng nhập

		const students = await StudentModel.find({
			smester_id: semester || dataDefault._id,
			campus_id: campusManager
		})
			.populate('business')
			.populate({ path: 'majorCode', match: { majorCode: { $exists: true } } });
		return res.status(200).json(students);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error'
		});
	}
};

// [PATCH] /api/student/:id
export const updateStudent = async (req, res) => {
	try {
		const data = req.body;
		const id = req.params.id;
		const campus = req.campusManager;

		const student = await checkStudentExist(id, campus);

		const result = await StudentModel.findOneAndUpdate({ _id: id }, data, {
			new: true
		});
		return res.status(201).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error'
		});
	}
};

// [DELETE] /api/student/:id
export const removeStudent = async (req, res) => {
	try {
		const id = req.params.id;
		const campus = req.campusManager;

		const student = await checkStudentExist(id, campus);

		const result = await StudentModel.findOneAndDelete({ _id: id });
		return res.status(200).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error'
		});
	}
};

// [GET] /api/student/:id
export const readOneStudent = async (req, res) => {
	try {
		const id = req.params.id;

		const student = await StudentModel.findOne({ _id: id })
			.populate('campus_id')
			.populate('smester_id')
			.populate('business')
			.populate({ path: 'major' })
			.populate('narrow');

		if (!student) {
			throw createHttpError(404, 'Học sinh không tồn tại');
		}

		return res.status(200).json(student);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error'
		});
	}
};

// [PATCH] /api/student (thêm người review cho student)
export const updateReviewerStudent = async (req, res) => {
	const { listIdStudent, email } = req.body;
	const campus = req.campusManager;
	try {
		// check xem admin có quyền sửa các học sinh không
		const studentNotExist = [];
		const checkStudentListExist = await StudentModel.find({
			_id: { $in: listIdStudent },
			campus_id: campus
		});
		if (checkStudentListExist.length < listIdStudent.length) {
			listIdStudent.forEach((idStudent) => {
				let check = checkStudentListExist.find((student) => student._id.toString() === idStudent.toString());
				if (!check) {
					studentNotExist.push(idStudent);
				}
			});

			throw createHttpError(404, 'Học sinh không tồn tại', { error: studentNotExist });
		}

		const data = await StudentModel.updateMany(
			{ _id: { $in: listIdStudent } },
			{
				$set: {
					reviewer: email
				}
			},
			{ multi: true }
		);
		return res.status(201).json({ listIdStudent, email });
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error'
		});
	}
};

// [PATCH] /api/student/business
export const updateBusinessStudent = async (req, res) => {
	const { listIdStudent, business } = req.body;
	const campus = req.campusManager;
	try {
		const semester = await getCurrentSemester(campus);
		// check xem doanh nghiệp có tồn tại không
		const businessCheck = await BusinessModel.findOne({
			_id: business,
			campus_id: campus,
			smester_id: semester._id
		});

		if (!businessCheck) throw createHttpError(404, 'Công ty không tồn tại!');

		const data = await StudentModel.updateMany(
			{ _id: { $in: listIdStudent }, campus_id: campus, smester_id: semester._id },
			{
				$set: {
					business: business
				}
			},
			{ multi: true }
		);
		return res.status(201).json({ listIdStudent, business });
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error'
		});
	}
};

export const getStudentsToReview = async (req, res) => {
	try {
		const campus = req.campusManager;
		const semester = await getCurrentSemester(campus);
		const reviewType = req.query.type;
		if (!Object.values(StudentReviewTypeEnum).includes(reviewType)) {
			throw createHttpError.BadRequest('Invalid review type !');
		}
		const students = await StudentService.getStudentsToReview({ reviewType, semester: semester._id, campus });
		return res.status(HttpStatusCode.OK).json(students);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

// [PATCH] /api/student/status (update trạng thái sinh viên)
export const updateStatusStudent = async (req, res) => {
	const { listIdStudent, status, listEmailStudent, textNote, reviewerEmail } = req.body;
	const link = req.protocol + '://' + req.get('host');

	try {
		const updatedStudents = await StudentModel.updateMany(
			{
				_id: { $in: listIdStudent }
			},
			{
				$set: {
					reviewer: reviewerEmail,
					statusCheck: status,
					note: textNote
				}
			},
			{ multi: true, new: true }
		);

		switch (+status) {
			case 1:
				await sendMail({
					recipients: listEmailStudent,
					...getMailTemplate('CV_CHANGE_REQUEST', textNote, link)
				});
				break;
			case 2:
				await sendMail({
					recipients: listEmailStudent,
					...getMailTemplate('RECEIVED_CV', link)
				});
				break;
			case 3:
				await sendMail({
					recipients: listEmailStudent,
					...getMailTemplate('INTERN_FAILURE', textNote)
				});
				break;
			case 5:
				await sendMail({
					recipients: listEmailStudent,
					...getMailTemplate('RECORD_CHANGE_REQUEST', textNote)
				});
				break;
			case 6:
				await sendMail({
					recipients: listEmailStudent,
					...getMailTemplate('RECEIVE_REPORT', link)
				});
				break;
			case 8:
				await sendMail({
					recipients: listEmailStudent,
					...getMailTemplate('REPORT_REGISTRATION', textNote, link)
				});
				break;
			case 9:
				await sendMail({
					recipients: listEmailStudent,
					...getMailTemplate('RECEIVE_REPORT', link)
				});
				break;
			default:
				break;
		}

		return res.status(201).json(updatedStudents);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

// [GET] /api/student/reviewcv
export const listStudentReviewCV = async (req, res) => {
	try {
		const campus = req.campusManager;
		const semester = await getCurrentSemester(campus);
		const listStudentReviewCV = await StudentModel.find({
			CV: { $ne: null },
			form: null,
			report: null,
			statusCheck: { $in: [0, 1] },
			campus_id: campus,
			smester_id: semester._id
		})
			.populate('campus_id')
			.populate('smester_id')
			.populate('business')
			.populate({ path: 'majorCode' });

		return res.status(200).json(listStudentReviewCV);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error'
		});
	}
};

export const importStudents = async (req, res) => {
	try {
		const { data, smester_id, campus_id } = req.body;
		const { error, value: validatedStudentsList } = validateDataCreateStudentList(data);
		if (error) {
			throw createHttpError.BadRequest(error.message);
		}
		const importResult = await StudentService.createListStudent({
			semesterId: smester_id,
			campusId: campus_id,
			data: validatedStudentsList
		});
		return res.status(201).json(importResult);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};
