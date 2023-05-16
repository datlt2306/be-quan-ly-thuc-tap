import moment from "moment";
import { sendMail } from "./email.controller";

const Student = require("../models/student.model");
export const report = async (req, res) => {
  const {
    attitudePoint,
    EndInternShipTime,
    mssv,
    email,
    report,
    nameCompany,
    resultScore,
    _id,
    signTheContract
  } = req.body;
  const filter = { mssv: mssv, email: email, _id };
  const findStudent = await Student.findOne(filter);
  const startTimeReport = moment(findStudent.internshipTime).valueOf();
  const endTimeReport = moment(EndInternShipTime).valueOf();
  const checkTimeReport = endTimeReport > startTimeReport;
  try {
    const dataEmail = {};
    if (!checkTimeReport) {
      return res.status(500).send({
        message: "Thời gian kết thúc thực tập phải lớn hơn thời gian bắt đầu!",
      });
    }

    if (!findStudent) {
      const err = {
        status: false,
        message: "Đã xảy ra lỗi! Vui đăng ký lại!",
      };
      res.status(404).send(err);
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

    const update = {
      attitudePoint: attitudePoint,
      endInternShipTime: EndInternShipTime,
      nameCompany: nameCompany,
      resultScore: resultScore,
      report: report,
      statusCheck: 7,
      signTheContract: signTheContract
    };

    if (findStudent.statusCheck === 0 && findStudent.form) {
      const err = {
        status: false,
        message: "Thông tin biên bản đã tồn tại và đang chờ xác nhận!",
      };
      res.status(500).send(err);
      return;
    }

    if (findStudent.statusCheck === 8) {
      update.note = null;
      await Student.findOneAndUpdate(filter, update, {
        new: true,
      });
      dataEmail.mail = email;
      dataEmail.subject = "Sửa thông tin báo cáo thành công";
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
      return res.status(200).send({ message: "Sửa báo cáo thành công" });
    }

    if (findStudent.statusCheck === 6) {
      await Student.findOneAndUpdate(filter, update, {
        new: true,
      });
      dataEmail.mail = email;
      dataEmail.subject = "Đăng ký thông tin báo cáo thành công";
      dataEmail.content = /*html*/`
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
      return res.status(200).send({ message: "Nộp báo cáo thành công" });
    }
  } catch (error) {
    res.status(500).send({
      message: "Đã xảy ra lỗi! Vui lòng kiểm tra lại thông tin biên bản!",
    });
  }
};

export const form = async (req, res) => {
  try {
    const dataEmail = {};
    const { nameCompany, internshipTime, form, mssv, email, _id } =
      req.body;
    const filter = { mssv: mssv, email: email, _id };
    const findStudent = await Student.findOne(filter);
    if (!findStudent) {
      const err = {
        status: false,
        message: "Đã xảy ra lỗi! Vui lòng đăng ký lại!",
      };
      res.status(404).send(err);
    }
    if (findStudent.statusCheck === 0 && findStudent.form !== null) {
      const err = {
        status: false,
        message: "CV phải được duyệt trước khi nộp biên bản!",
      };
      res.status(500).send(err);
      return;
    }

    if (findStudent.statusCheck === 3) {
      const err = {
        message: "CV của bạn trượt không đủ điều kiện nộp báo cáo!",
      };
      res.status(500).send(err);
      return;
    }

    if (findStudent.statusCheck === 0 && findStudent.form) {
      const err = {
        message: "Biên bản của bạn đang được kiểm tra !",
      };
      res.status(500).send(err);
      return;
    }
    const update = {
      internshipTime: internshipTime,
      form: form,
      report: null,
      statusCheck: 4,
    };

    if (findStudent.support === 1) {
      update.nameCompany = nameCompany;
    }

    // Gửi mail
    // if (findStudent.statusCheck === 5) {
    //   update.note = null;
    //   await Student.findOneAndUpdate(filter, update, {
    //     new: true,
    //   });

    //   dataEmail.mail = email;
    //   dataEmail.subject = "Sửa thông tin biên bản thành công";
    //   dataEmail.content = /*html*/`
    //   <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
    //   <div class="adM">
    //   </div>
    //   <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
    //   <p>
    //       Xin chào <b>${findStudent.name}</b>,
    //       <br>
    //       Bạn vừa <b style="color:green"><span><span class="il">chỉnh</span></span> <span><span class="il">sửa</span></span> <span>thành</span> <span>công</span></b> thông tin <b><span>Biên</span> <span>bản</span></b>
    //       <br>
    //       Trạng thái hiện tại của dịch vụ là <b style="color:orange">Đã nộp biên bản </b>
    //       <br>
    //       Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
    //   </p>
    //   <hr style="border-top:1px solid">
    //   <div style="font-style:italic">
    //       <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại bên dưới</span>
    //       <div class="yj6qo"></div>
    //       <div class="adL"></div>
    //       <div class="adL"><br>
    //       </div>
    //   </div>
    //   <div class="adL">
    //   </div>
    //   <div class="adL">
    //   </div>
    //   <div class="adL">
    //   </div>
    //   </div>
    //   `;
    //   await sendMail(dataEmail);

    //   return res.status(200).send({ message: "Sửa biên bản thành công" });
    // }
    // if (findStudent.statusCheck === 2) {
    //   await Student.findOneAndUpdate(filter, update, {
    //     new: true,
    //   });
    //   dataEmail.mail = email;
    //   dataEmail.subject = "Đăng ký thông tin biên bản thành công";
    //   dataEmail.content = `
    //   <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
    //   <div class="adM">
    //   </div>
    //   <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
    //   <p>
    //       Xin chào <b>${findStudent.name}</b>,
    //       <br>
    //       Bạn vừa <b style="color:green"><span><span class="il">đăng</span></span> <span><span class="il">ký</span></span> <span>thành</span> <span>công</span></b> thông tin <b><span>Biên</span> <span>bản</span></b>
    //       <br>
    //       Trạng thái hiện tại của dịch vụ là <b style="color:orange">Đã nộp biên bản </b>
    //       <br>
    //       Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
    //   </p>
    //   <hr style="border-top:1px solid">
    //   <div style="font-style:italic">
    //       <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại bên dưới</span>
    //       <div class="yj6qo"></div>
    //       <div class="adL"></div>
    //       <div class="adL"><br>
    //       </div>
    //   </div>
    //   <div class="adL">
    //   </div>
    //   <div class="adL">
    //   </div>
    //   <div class="adL">
    //   </div>
    //   </div>
    //   `;
    //   await sendMail(dataEmail);
    //   return res.status(200).send({ message: "Nộp biên bản thành công" });
    // }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Có lỗi xảy ra! Vui lòng quay lại sau ít phút" });
  }
};
