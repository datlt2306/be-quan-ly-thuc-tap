import createHttpError from 'http-errors';
require('dotenv').config();
import { getCurrentSemester } from '../controllers/semesterController';
import StudentModel from '../models/student';
import MajorModel from '../models/major';
import {
	validateDataCreateStudentList,
	validateUpdateStatus,
} from '../validation/student.validation';
import { selectOneStatus } from './statusStudent.service';
import { transporter } from '../controllers/emailController';
import { replaceContentMail } from '../utils/toolkit';
const apiKey = 'cc126cffe46824f121e00226099067e3-us21';

// check xem học sinh có tồn tại ở cơ sở và kỳ hiện tại không
export const checkStudentExist = async (id, campus) => {
	try {
		const semester = await getCurrentSemester(campus);

		// kiêm tra xem student có tồn tại không
		const student = await StudentModel.findOne({
			_id: id,
			campus_id: campus,
			semester_id: semester._id,
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
export const createListStudent = async (data, campus) => {
	try {
		if (!Array.isArray(data)) throw createHttpError(400, 'Body data type phải là array');
		if (data.length === 0) throw createHttpError(204);

		// validate list data
		const { error } = validateDataCreateStudentList(data);

		if (error) {
			throw createHttpError(400, error.message);
		}

		const { _id: semester_id } = await getCurrentSemester(campus);

		// bảng chứa các mã ngành của data gửi lên
		const majorCodeReqBodyData = [];
		// bảng chứa mssv của data gửi lên
		const mssvReqBodyData = [];

		data.forEach((student, index) => {
			if (!majorCodeReqBodyData.includes(student.majorCode)) {
				majorCodeReqBodyData.push(student.majorCode);
			}

			// thêm campus và semester cho student
			data[index] = {
				...student,
				semester_id: semester_id,
				campus_id: campus,
			};

			mssvReqBodyData.push(student.mssv);
		});

		// kiểm tra các ngành gửi lên có tồn tại không
		const majorNotExists = [];
		const majorExists = await MajorModel.find({
			campus: campus,
			majorCode: { $in: majorCodeReqBodyData },
		})
			.select('majorCode')
			.lean();
		const majorCodeExists = majorExists.map((major) => major.majorCode);

		if (majorCodeExists.length !== majorCodeReqBodyData.length) {
			majorCodeReqBodyData.forEach((item) => {
				if (!majorCodeExists.includes(item)) {
					majorNotExists.push(item);
				}
			});

			throw createHttpError(404, 'Chuyên ngành không tồn tại', { error: majorNotExists });
		}

		// thay thế majorCode bằng majorId
		data.forEach((student, index) => {
			let { _id: majorId } = majorExists.find((item) => item.majorCode === student.majorCode);
			delete data[index].majorCode;
			data[index] = {
				...student,
				major: majorId,
			};
		});

		// kiểm tra kỳ hiện tại đã nhập sinh viên chưa
		const checkStudentCurrSemester = await StudentModel.findOne({
			semester_id: semester_id,
			campus_id: campus,
		})
			.select('mssv')
			.lean();

		let countStudentCreate = null;
		if (Boolean(checkStudentCurrSemester)) {
			// Đã nhập rồi
			// lấy ra các sinh viên đã tồn tại
			const studentExists = await StudentModel.find({
				mssv: { $in: mssvReqBodyData },
				semester_id: semester_id,
				campus_id: campus,
			})
				.select('mssv')
				.lean();
			const mssvStudentExists = studentExists.map((item) => item.mssv.toLowerCase());
			// các sinh viên được thêm vào
			let studentCreate = data.filter((student) => {
				return !mssvStudentExists.includes(student.mssv.toLowerCase());
			});

			// create
			await StudentModel.insertMany(studentCreate);
			countStudentCreate = studentCreate.length;
		} else {
			// Chưa nhập
			await StudentModel.insertMany(data);
			countStudentCreate = data.length;
		}

		return {
			message: `${countStudentCreate} sinh viên đã được thêm vào hệ thống, ${
				data.length - countStudentCreate
			} sinh viên đã tồn tại`,
		};
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
			semester_id: semester._id,
		}).lean();

		if (checkStudentListExist.length < listIdStudent.length) {
			listIdStudent.forEach((idStudent) => {
				let check = checkStudentListExist.find(
					(student) => student._id.toString() === idStudent.toString()
				);
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
				campus_id: campus,
			},
			{
				statusCheck: statusValue,
				note: textNote,
			},
			{
				multi: true,
			}
		);

		// gửi mail thông báo
		let content = replaceContentMail(statusStudent.contentMail, {
			hostname,
			note: textNote,
			statusTitle: statusStudent.title,
		});
		const listEmailStudent = checkStudentListExist.map((student) => student.email);

		await transporter.sendMail({
			from: '"Phòng QHDN" <' + process.env.USER_EMAIL + '>',
			to: listEmailStudent,
			html: content,
			subject: statusStudent.titleMail,
		});

		return {
			message: 'Thay đổi trạng thái sinh viên thành công',
		};
	} catch (error) {
		throw error;
	}
};
