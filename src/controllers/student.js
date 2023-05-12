import StudentModel from '../models/student';
import BusinessModel from '../models/business';
import { sendMail } from './emailController';
import SemesterModel from '../models/semester';
import { getCurrentSemester } from './semesterController';
import createHttpError from 'http-errors';
import { checkStudentExist } from '../services/student.service';
import * as studentServices from '../services/student.service';

const ObjectId = require('mongodb').ObjectID;

// [GET] /api/student?limit=20&page=1
export const listStudent = async (req, res) => {
	const semester = req.query.semester;
	// campusManager được thêm từ middleware
	const campusManager = req.campusManager;
	try {
		// xác định học kỳ hiện tại
		const dataDefault = await SemesterModel.findOne({
			$and: [{ start_time: { $lte: new Date() } }, { end_time: { $gte: new Date() } }],
			campus_id: campusManager,
		});
		// lấy ra các học sinh thỏa mãn đăng ký kỳ hiện tại và thuộc cơ sở của manger đăng nhập

		const students = await StudentModel.find({
			smester_id: semester || dataDefault._id,
			campus_id: campusManager,
		}).populate({ path: 'major', select: 'name', match: { majorCode: { $exists: true } } });

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
			.populate({ path: 'major' })
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
	const { data, smester_id, campus_id } = req.body;
	try {
		const checkStudent = await StudentModel.find({}).limit(3);

		if (checkStudent.length > 0) {
			const listMSSV = await StudentModel.find({ smester_id, campus_id });
			if (listMSSV.length === 0) {
				await StudentModel.insertMany(data);
			} else {
				const listMS = [];
				listMSSV.forEach((item) => {
					listMS.push(item.mssv);
				});
				const listNew = [];
				await data.forEach((item) => {
					listNew.push(item.mssv);
				});

				await StudentModel.updateMany(
					{ smester_id, campus_id },
					{
						$set: {
							checkUpdate: false,
							checkMulti: false,
						},
					},
					{ multi: true }
				);

				await StudentModel.updateMany(
					{
						$and: [{ mssv: { $in: listNew } }, { smester_id, campus_id }],
					},
					{
						$set: {
							checkUpdate: true,
							checkMulti: true,
						},
					},
					{ multi: true }
				);

				await StudentModel.updateMany(
					{ $and: [{ checkUpdate: false }, { smester_id, campus_id }] },
					{
						$set: {
							statusCheck: 3,
							checkUpdate: true,
							checkMulti: true,
						},
					},
					{ multi: true }
				);

				await StudentModel.insertMany(data);

				await StudentModel.updateMany(
					{
						$and: [{ mssv: { $nin: listMS } }, { smester_id, campus_id }],
					},
					{
						$set: {
							checkMulti: true,
						},
					},
					{ multi: true }
				);

				await StudentModel.deleteMany({
					$and: [{ checkMulti: false }, { smester_id, campus_id }],
				});
			}

			await StudentModel.find({ smester_id })
				.populate('campus_id')
				.populate('smester_id')
				.populate('business')
				.populate({ path: 'major' })
				.limit(20)
				.sort({ statusCheck: 1 })
				.exec((err, doc) => {
					if (err) {
						throw err;
					} else {
						StudentModel.find({ smester_id, campus_id })
							.countDocuments({})
							.exec((count_error, count) => {
								if (err) {
									res.json(count_error);
									return;
								} else {
									return res.status(200).json({
										total: count,
										list: doc,
									});
								}
							});
					}
				});
		} else {
			await StudentModel.insertMany(req.body.data);
			await StudentModel.find({ smester_id })
				.populate('campus_id')
				.populate('smester_id')
				.populate('business')
				.populate({ path: 'major' })
				.limit(20)
				.sort({ statusCheck: 1 })
				.exec((err, doc) => {
					if (err) {
						res.status(400).json(err);
					} else {
						StudentModel.find({ smester_id, campus_id })
							.countDocuments({})
							.exec((count_error, count) => {
								if (err) {
									res.json(count_error);
									return;
								} else {
									res.status(200).json({
										total: count,
										list: doc,
									});
									return;
								}
							});
					}
				});
		}
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
	const { listIdStudent, status, listEmailStudent, textNote } = req.body;
	const dataEmail = {};
	const hostname = req.get('host');
	const listIdStudents = await listIdStudent.map((id) => ObjectId(id));
	const newArr = [];
	if (listEmailStudent) {
		listEmailStudent.forEach((value) => {
			newArr.push(value.email);
		});
	}
	dataEmail.mail = newArr;

	try {
		await StudentModel.updateMany(
			{
				_id: { $in: listIdStudents },
			},
			{
				$set: {
					statusCheck: status,
					note: textNote,
				},
			},
			{ multi: true, new: true }
		);
		const listStudentChangeStatus = await StudentModel.find({
			_id: { $in: listIdStudent },
			statusCheck: status,
			note: textNote,
		}).select('name');

		if (status === 1) {
			dataEmail.subject = 'Thông báo sửa CV thực tập doanh nghiệp';
			dataEmail.content = `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <p>
        Phòng QHDN yêu cầu bạn sửa lại thông tin <b style="color:green"><span><span class="il">CV</span></span> <span></span></b><br>
        Lý do SV phải sửa CV: ${textNote} <br>
        Trạng thái hiện tại của dịch vụ là <b style="color:orange">Sửa CV </b>
        <br>
        Sinh vi&ecirc;n vui l&ograve;ng đăng nhập v&agrave;o trang web <a href="http://${hostname}">${hostname}</a>&nbsp;sửa CV
        <br>
        Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
      </p>
      <hr style="border-top:1px solid">
      <div style="font-style:italic">
      <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại: </span>
      <a face="arial, sans-serif" href="tel:0246264713">024 6264713</a>
          <div class="yj6qo"></div>
          <div class="adL"></div>
          <div class="adL"><br>
          </div>
      </div>
      <div class="adL">
      </div>
      <div class="adL">
      </div>
      <div class="adL">
      </div>
      </div>
      `;
			await sendMail(dataEmail);
		} else if (status === 2) {
			dataEmail.subject = 'Thông báo nhận CV sinh viên thành công';
			dataEmail.content = `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <p>
          Xin chào sinh viên,<br>
          CV của bạn đã được phòng QHDN <b><span>Xác</span> <span>Nhận</span></b>
          <br>
          Trạng thái hiện tại của dịch vụ là <b style="color:orange">Nhận CV </b><br>
          Sinh vi&ecirc;n vui l&ograve;ng đăng nhập v&agrave;o trang web <a href="http://${hostname}">${hostname}</a>&nbsp;xem trạng thái CV
          <br>
          Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
      </p>
      <hr style="border-top:1px solid">
      <div style="font-style:italic">
      <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại: </span>
      <a face="arial, sans-serif" href="tel:0246264713">024 6264713</a>
          <div class="yj6qo"></div>
          <div class="adL"></div>
          <div class="adL"><br>
          </div>
      </div>
      <div class="adL">
      </div>
      <div class="adL">
      </div>
      <div class="adL">
      </div>
      </div>
      `;
			await sendMail(dataEmail);
		} else if (status === 3) {
			dataEmail.subject = 'Thông báo sinh viên trượt thực tập doanh nghiệp';
			dataEmail.content = `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <>
          Xin chào Sinh viên,<br>
          Bạn đã trượt thực tập. Phòng QHDN <b><span>Xác</span> <span>Nhận</span></b>
          <br>
          Lý do SV trượt: ${textNote}<br>
          Trạng thái hiện tại của dịch vụ là <b style="color:orange">Trượt thực tập </b>
          <br>
          Sinh vi&ecirc;n vui l&ograve;ng đăng k&yacute; thực tập lại v&agrave;o kỳ sau tr&ecirc;n hệ thống <a href="https://ap.poly.edu.vn/">ap.poly.edu.vn</a>
          <br>
          Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
      </p>
      <hr style="border-top:1px solid">
      <div style="font-style:italic">
           <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại: </span>
      <a face="arial, sans-serif" href="tel:0246264713">024 6264713</a>
          <div class="yj6qo"></div>
          <div class="adL"></div>
          <div class="adL"><br>
          </div>
      </div>
      <div class="adL">
      </div>
      <div class="adL">
      </div>
      <div class="adL">
      </div>
      </div>
      `;
			await sendMail(dataEmail);
		} else if (status === 5) {
			dataEmail.subject = 'Thông báo sửa biên bản thực tập doanh nghiệp';
			dataEmail.content = `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <p>
          Xin chào Sinh viên,<br>
          Phòng QHDN yêu cầu bạn sửa lại thông tin <b style="color:green"><span><span class="il">Biên</span></span> <span><span class="il">bản</span></span></b>
          <br>
          Lý do SV phải sửa báo cáo: ${textNote}
          <br>
          Trạng thái hiện tại của dịch vụ là <b style="color:orange">Sửa biên bản </b>
          <br>
          Sinh vi&ecirc;n vui l&ograve;ng đăng nhập v&agrave;o trang web <a href="http://${hostname}">${hostname}</a>&nbsp;sửa biên bản
      </p>
      <hr style="border-top:1px solid">
      <div style="font-style:italic">
           <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại: </span>
      <a face="arial, sans-serif" href="tel:0246264713">024 6264713</a>
          <div class="yj6qo"></div>
          <div class="adL"></div>
          <div class="adL"><br>
          </div>
      </div>
      <div class="adL">
      </div>
      <div class="adL">
      </div>
      <div class="adL">
      </div>
      </div>
      `;
			await sendMail(dataEmail);
		} else if (status === 6) {
			dataEmail.subject = 'Thông báo nhận biên bản sinh viên thành công';
			dataEmail.content = `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <>
          Xin chào Sinh viên,<br>
          Biên bản của bạn đã được phòng QHDN <b><span>Xác</span> <span>Nhận</span></b>
          <br>
          Trạng thái hiện tại của dịch vụ là <b style="color:orange">Đang thực tập </b>
          <br>
          Sinh vi&ecirc;n vui l&ograve;ng đăng nhập v&agrave;o trang web <a href="http://${hostname}">${hostname}</a>&nbsp;xem trạng thái báo cáo
      </p>
      <hr style="border-top:1px solid">
      <div style="font-style:italic">
           <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại: </span>
      <a face="arial, sans-serif" href="tel:0246264713">024 6264713</a>
          <div class="yj6qo"></div>
          <div class="adL"></div>
          <div class="adL"><br>
          </div>
      </div>
      <div class="adL">
      </div>
      <div class="adL">
      </div>
      <div class="adL">
      </div>
      </div>
      `;
			await sendMail(dataEmail);
		} else if (status === 8) {
			dataEmail.subject = 'Thông báo sinh viên sửa báo cáo thực tập doanh nghiệp';
			dataEmail.content = `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <>
          Xin chào Sinh viên,<br>
          Phòng QHDN yêu cầu bạn sửa lại thông tin <b style="color:green"><span><span class="il">Báo</span></span> <span><span class="il">cáo</span></span></b>
          <br>
          Lý do SV phải sửa báo cáo: ${textNote}<br>
          Trạng thái hiện tại của dịch vụ là <b style="color:orange">Sửa báo cáo </b><br>
          Sinh vi&ecirc;n vui l&ograve;ng đăng nhập v&agrave;o trang web <a href="http://${hostname}">${hostname}</a>&nbsp;sửa báo cáo
          <br>
          Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
      </p>
      <hr style="border-top:1px solid">
      <div style="font-style:italic">
           <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại: </span>
      <a face="arial, sans-serif" href="tel:0246264713">024 6264713</a>
          <div class="yj6qo"></div>
          <div class="adL"></div>
          <div class="adL"><br>
          </div>
      </div>
      <div class="adL">
      </div>
      <div class="adL">
      </div>
      <div class="adL">
      </div>
      </div>
      `;
			await sendMail(dataEmail);
		} else if (status === 9) {
			dataEmail.subject = 'Thông báo Hoàn thành thông tin thực tập sinh viên thành công';
			dataEmail.content = `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <>
          Xin chào Sinh viên,<br>
          Bạn đã hoành thành thông tin thực tập. Phòng QHDN <b><span>Xác</span> <span>Nhận</span></b>
          <br>
          Trạng thái hiện tại của dịch vụ là <b style="color:orange">Hoàn thành báo cáo thực tập </b>
          <br>
          Điểm của bạn sẽ được phòng QHDN cập nhật sau 1-2 ngày trên hệ thống  <a href="https://ap.poly.edu.vn/">ap.poly.edu.vn</a>
          <br>
          Sinh vi&ecirc;n vui l&ograve;ng đăng nhập v&agrave;o trang web <a href="http://${hostname}">${hostname}</a>&nbsp;xem trạng thái báo cáo
      </p>
      <hr style="border-top:1px solid">
      <div style="font-style:italic">
           <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại: </span>
      <a face="arial, sans-serif" href="tel:0246264713">024 6264713</a>
          <div class="yj6qo"></div>
          <div class="adL"></div>
          <div class="adL"><br>
          </div>
      </div>
      <div class="adL">
      </div>
      <div class="adL">
      </div>
      <div class="adL">
      </div>
      </div>
      `;
			await sendMail(dataEmail);
		}
		return res.status(201).json({ listStudentChangeStatus, status });
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
