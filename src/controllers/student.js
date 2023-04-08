import StudentModel from '../models/student';
import BusinessModel from '../models/business';
import { sendMail } from './emailController';
import semester from '../models/semester';
import { getCurrentSemester } from './semesterController';
import createHttpError from 'http-errors';
import { checkStudentExist } from '../services/student.service';
import * as studentServices from '../services/student.service';

const ObjectId = require('mongodb').ObjectID;

// [GET] /api/student?limit=20&page=1
export const listStudent = async (req, res) => {
	const page = req.query.page || 1;
	const limit = req.query.limit || 20;
	// campusManager được thêm từ middleware
	const campusManager = req.campusManager;

	try {
		// xác định học kỳ hiện tại
		const dataDefault = await semester.findOne({
			$and: [{ start_time: { $lte: new Date() } }, { end_time: { $gte: new Date() } }],
			campus_id: campusManager,
		});

		// lấy ra các học sinh thỏa mãn đăng ký kỳ hiện tại và thuộc cơ sở của manger đăng nhập
		const students = await StudentModel.paginate(
			{
				...req.query,
				smester_id: dataDefault._id,
				campus_id: campusManager,
			},
			{
				page: Number(page),
				limit: Number(limit),
				populate: ['campus_id', 'smester_id', 'business'],
				sort: { statusCheck: 1 },
				customLabels: {
					totalDocs: 'total',
					docs: 'list',
				},
			}
		);

		return res.status(200).json(students);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
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
			new: true,
		});
		return res.status(201).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
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
			message: error.message || 'Internal Server Error',
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
			.populate('majors')
			.populate('narrow');

		if (!student) {
			throw createHttpError(404, 'Học sinh không tồn tại');
		}

		return res.status(200).json(student);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

// [POST] /api/student
export const insertStudent = async (req, res) => {
	const data = req.body;
	const campus = req.campusManager;
	try {
		const result = await studentServices.createListStudent(data, campus);

		return res.status(201).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
			error: error.error,
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
			campus_id: campus,
		});

		if (checkStudentListExist.length < listIdStudent.length) {
			listIdStudent.forEach((idStudent) => {
				let check = checkStudentListExist.find(
					(student) => student._id.toString() === idStudent.toString()
				);
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
					reviewer: email,
				},
			},
			{ multi: true }
		);
		return res.status(201).json({ listIdStudent, email });
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
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
			smester_id: semester._id,
		});

		if (!businessCheck) throw createHttpError(404, 'Công ty không tồn tại!');

		const data = await StudentModel.updateMany(
			{ _id: { $in: listIdStudent }, campus_id: campus, smester_id: semester._id },
			{
				$set: {
					business: business,
				},
			},
			{ multi: true }
		);
		return res.status(201).json({ listIdStudent, business });
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};

// [PATCH] /api/student/status (update trạng thái sinh viên)
export const updateStatusStudent = async (req, res) => {
	const data = req.body;
	const campus = req.campusManager;
	const hostname = req.get('host');
	try {
		const result = await studentServices.updateStatusStudent(data, hostname, campus);
		return res.status(201).json(result);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
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
			smester_id: semester._id,
		})
			.populate('campus_id')
			.populate('smester_id')
			.populate('business')
			.populate('majors');

		return res.status(200).json(listStudentReviewCV);
	} catch (error) {
		return res.status(error.statusCode || 500).json({
			statusCode: error.statusCode || 500,
			message: error.message || 'Internal Server Error',
		});
	}
};
