import createHttpError from 'http-errors';
import { getCurrentSemester } from '../controllers/semesterController';
import StudentModel from '../models/student';
import MajorModel from '../models/major';
import { validateDataCreateStudentList } from '../validation/student.validation';

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

		const { _id: semesterId } = await getCurrentSemester(campus);

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
				smester_id: semesterId,
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
				majors: majorId,
			};
		});

		// kiểm tra kỳ hiện tại đã nhập sinh viên chưa
		const checkStudentCurrSemester = await StudentModel.findOne({
			smester_id: semesterId,
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
				smester_id: semesterId,
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
export const updateStatusStudent = async (idStudents, statusValue) => {
	try {
	} catch (error) {
		throw error;
	}
};
