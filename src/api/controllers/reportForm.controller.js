import moment from 'moment';
import { sendMail } from './email.controller';
import { uploadFile } from '../services/googleDrive.service';
import studentModel from '../models/student.model';
import { generateEmail } from '../../utils/emailTemplate';
import { reportSchema } from '../validation/reportForm.validation';
import createHttpError from 'http-errors';

export const report = async (req, res) => {
	const {
		attitudePoint,
		EndInternShipTime,
		mssv,
		email,
		nameCompany,
		resultScore,
		_id,
		signTheContract,
	} = req.body;

	const filter = { mssv: mssv, email: email, _id };
	const findStudent = await studentModel.findOne(filter);
	const startTimeReport = moment(findStudent.internshipTime).valueOf();
	const endTimeReport = moment(EndInternShipTime).valueOf();
	const checkTimeReport = endTimeReport > startTimeReport;
	try {
		const dataEmail = {};
		if (!checkTimeReport) {
			return res.status(500).send({
				message: 'Thời gian kết thúc thực tập phải lớn hơn thời gian bắt đầu!',
			});
		}

		if (!findStudent) {
			return res
				.status(404)
				.send({ status: false, message: 'Đã xảy ra lỗi! Vui đăng ký lại!' });
		}

		// if (nameCompany) {
		//   const nameCompanyD = findStudent.nameCompany === nameCompany;
		//   if (!nameCompanyD) {
		//     const err = {
		//       message: "Tên công ty không khớp với biểu mẫu!",
		//     };
		//     res.status(500).send(err);
		//     return;
		//   }
		// }

		// if (business) {
		//   const nameBusiness = findStudent.business === business;
		//   if (!nameBusiness) {
		//     const err = {
		//       message: "Tên công ty không khớp với biểu mẫu!",
		//     };
		//     res.status(500).send(err);
		//     return;
		//   }
		// }

		const [file] = req.files;

		const uploadedFile = uploadFile(file);

		const update = {
			attitudePoint: attitudePoint,
			endInternShipTime: EndInternShipTime,
			nameCompany: nameCompany,
			resultScore: resultScore,
			report: uploadedFile.url,
			statusCheck: 7,
			signTheContract: signTheContract,
		};

		if (findStudent.statusCheck === 0 && findStudent.form) {
			const err = {
				status: false,
				message: 'Thông tin biên bản đã tồn tại và đang chờ xác nhận!',
			};
			res.status(500).send(err);
			return;
		}

		if (findStudent.statusCheck === 8) {
			update.note = null;
			const result = await studentModel.findOneAndUpdate(filter, update, {
				new: true,
			});

			return res.status(200).send(result);
			dataEmail.mail = email;
			dataEmail.subject = 'Sửa thông tin báo cáo thành công';
			dataEmail.content = `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <p>
          Xin chào <b>${findStudent.name}</b>,
          <br>
          Bạn vừa <b style="color:green"><span><span class="il">chỉnh</span></span> <span><span class="il">sửa</span></span> <span>thành</span> <span>công</span></b> thông tin <b><span>Báo</span> <span>cáo</span></b>
          <br>
          Trạng thái hiện tại của dịch vụ là <b style="color:orange">Đã nộp báo cáo </b>
          <br>
          Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
      </p>
      <hr style="border-top:1px solid">
      <div style="font-style:italic">
          <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại bên dưới</span>
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
			return res.status(200).send({ message: 'Sửa báo cáo thành công' });
		}

		if (findStudent.statusCheck === 6) {
			await studentModel.findOneAndUpdate(filter, update, {
				new: true,
			});
			dataEmail.mail = email;
			dataEmail.subject = 'Đăng ký thông tin báo cáo thành công';
			dataEmail.content = /*html*/ `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <p>
          Xin chào <b>${findStudent.name}</b>,
          <br>
          Bạn vừa <b style="color:green"><span><span class="il">đăng</span></span> <span><span class="il">ký</span></span> <span>thành</span> <span>công</span></b> thông tin <b><span>Báo</span> <span>cáo</span></b>
          <br>
          Trạng thái hiện tại của dịch vụ là <b style="color:orange">Đã nộp báo cáo </b>
          <br>
          Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
      </p>
      <hr style="border-top:1px solid">
      <div style="font-style:italic">
          <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại bên dưới</span>
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
			return res.status(200).send({ message: 'Nộp báo cáo thành công' });
		}
		throw new Error();
	} catch (error) {
		res.status(500).send({
			message: 'Đã xảy ra lỗi! Vui lòng kiểm tra lại thông tin biên bản!',
		});
	}
};

export const form = async (req, res) => {
	try {
		let data, result, uploadedFile, error;

		const { nameCompany, internshipTime, mssv, email, _id } = req.body;
		const filter = { mssv: mssv, email: email, _id };
		const [file] = req.files;
		const findStudent = await studentModel.findOne(filter);

		if (!findStudent)
			return res
				.status(404)
				.send({ status: false, message: 'Đã xảy ra lỗi! Vui lòng đăng ký lại!' });

		switch (findStudent.statusCheck) {
			// Chờ kiểm tra CV
			case 0:
				if (!findStudent.CV)
					return res.status(500).send({
						message: 'CV không tồn tại trên hệ thống',
					});

				return res.status(403).send({
					message: 'CV phải được duyệt trước khi nộp biên bản!',
				});

			// Nhận CV
			case 2:
				if (!findStudent.support == 1)
					return res.status(403).send({
						message: 'Bạn chưa gửi form nhờ nhà trường hỗ trợ',
					});

				data = {
					nameCompany,
					internshipTime,
					form: uploadedFile.url,
					statusCheck: 4,
				};

				error = reportSchema.validate(data).error;

				if (error) return res.status(403).json('Sai dữ liệu: ' + error.message);

				result = await studentModel.findOneAndUpdate(filter, data, {
					new: true,
				});

				return res.status(200).json({ message: 'Nộp biên bản thành công', result });

			// Không đủ điều kiện
			case 3:
			case 10:
				return res.status(403).send({
					message: 'Bạn không đủ điều kiện nộp biên bản!',
				});

			// Đã nộp biên bản
			case 4:
				return res.status(403).send({
					message: 'Bạn đã nộp biên bản!',
				});

			// Sửa biên bản
			case 5:
				uploadedFile = await uploadFile(file);

				data = {
					nameCompany,
					internshipTime,
					form: uploadedFile.url,
					statusCheck: 4,
				};

				error = reportSchema.validate(data).error;

				if (error) return res.status(403).json('Sai dữ liệu: ' + error.message);

				result = await studentModel.findOneAndUpdate(
					filter,
					{ ...data, note: null },
					{
						new: true,
					}
				);

				return res.status(200).send({ message: 'Sửa biên bản thành công', result });

			// Đã đăng ký
			case 11:
				if (!findStudent.support == 0)
					return res.status(403).send({
						message: 'Form tự tìm của bạn chưa được duyệt hoặc server bị lỗi!',
					});

				uploadedFile = await uploadFile(file);

				data = {
					nameCompany,
					internshipTime,
					form: uploadedFile.url,
					statusCheck: 4,
				};

				error = reportSchema.validate(data).error;

				if (error) return res.status(403).json('Sai dữ liệu: ' + error.message);

				result = await studentModel.findOneAndUpdate(filter, data, {
					new: true,
				});

				return res.status(200).json({ message: 'Nộp biên bản thành công', result });

			default:
				throw new Error();
		}
	} catch (error) {
		console.error(error.message);
		return res.status(500).send({ message: 'Có lỗi xảy ra! Vui lòng quay lại sau ít phút' });
	}
};
