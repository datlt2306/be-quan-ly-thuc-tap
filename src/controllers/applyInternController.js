import { sendMail } from "./emailController";
const Student = require("../models/student");
export const signUpCVForSupport = async (req, res) => {
  const {
    address,
    email,
    dream,
    majors,
    name,
    phone,
    CV,
    support,
    unit,
    unitAddress,
    taxCode,
    position,
    numberEnterprise,
    emailEnterprise,
    business,
    _id,
    narrow
  } = req.body;
  try {
    const ms = req.body.user_code.toLowerCase();
    const dataEmail = {};

    const findStudent = await Student.findOne({
      mssv: ms,
      email: email,
      _id
    });
    const filter = {
      _id,
      mssv: ms,
      email: email,
    };
    if (!findStudent) {
      res.status(500).send({
        message: "Thông tin của bạn không tồn tại trên hệ thống!",
      });
      return;
    }
    if (findStudent.statusCheck === 0) {
      res.status(500).send({
        message: "Thông tin CV của bạn đã được đăng ký",
      });
      return;
    }

    // if (
    //   (findStudent.numberOfTime === 2 && findStudent.statusCheck === 1) ||
    //   (findStudent.numberOfTime === 2 && findStudent.statusCheck <= 3)
    // ) {
    //   res.status(500).send({
    //     message:
    //       "Tài khoạn của bạn đã vượt quá số lần đăng ký thông tin thực tập",
    //   });
    // }

    let isSupport = 0;
    support === 1 ? (isSupport = 0) : (isSupport = 2);

    const update = {
      address: address,
      dream: dream,
      email: email,
      majors: majors,
      name: name,
      phoneNumber: phone,
      CV: CV,
      form: null,
      report: null,
      statusCheck: isSupport,
      support: support,
      nameCompany: unit,
      addressCompany: unitAddress,
      taxCode: taxCode,
      position: position,
      phoneNumberCompany: numberEnterprise,
      emailEnterprise: emailEnterprise,
      business: business,
      narrow: narrow
    };

    // if (findStudent.statusCheck === 1 && findStudent.support === 0) {
    //   return res
    //     .status(500)
    //     .send({ message: "Thông tin tự đăng ký người dùng không được sửa" });
    // }
    if (findStudent.statusCheck === 1 && findStudent.support === 1) {
      //Ho tro
      update.note = null;
      const rptest = await Student.findOneAndUpdate(filter, update, {
        new: true,
      });

      dataEmail.mail = email;
      dataEmail.subject = "Sửa thông tin hỗ trợ thực tập thành công";
      dataEmail.content = `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <p>
          Xin chào <b>${name}</b>,<br>
          Bạn vừa <b style="color:green"><span><span class="il">chỉnh</span></span> <span><span class="il">sửa</span></span> <span>thành</span> <span>công</span></b> thông tin <b><span>Hỗ</span> <span>trợ</span> tìm nơi thực tập</b>
          <br>
          Trạng thái hiện tại của dịch vụ là <b style="color:orange">Chờ kiểm tra </b>
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

      return res
        .status(200)
        .send({ message: "Sửa thông tin CV thành công!", support: support });
    }

    if (findStudent.statusCheck === 10 && support === 1) {
      await Student.findOneAndUpdate(filter, update, {
        new: true,
      });

      dataEmail.mail = email;
      dataEmail.subject = "Đăng ký hỗ trợ thực tập thành công";
      dataEmail.content = `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <p>
          Xin chào <b>${name}</b>,
          <br>
          Bạn vừa <b style="color:green"><span><span class="il">đăng</span></span> <span><span class="il">ký</span></span> <span>thành</span> <span>công</span></b> thông tin <b><span>Hỗ</span> <span>trợ</span> tìm nơi thực tập</b>
          <br>
          Trạng thái hiện tại của dịch vụ là <b style="color:orange">Chờ kiểm tra </b>
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
      return res
        .status(200)
        .send({ message: "Đăng ký thông tin thành công!", support: support });
    }

    if (findStudent.statusCheck === 1 && findStudent.support === 0) {
      // if (findStudent.numberOfTime >= 2) {
      //   res.status(500).send({
      //     message: "Bạn đã vượt quá 2 lần cho phép sửa thông tin tự đăng ký!",
      //     support: support,
      //   });
      // }

      const count = findStudent.numberOfTime + 1;
      update.numberOfTime = count;
      update.note = null;
      await Student.findOneAndUpdate(filter, update, {
        new: true,
      });

      dataEmail.mail = email;
      dataEmail.subject = "Sửa thông tin tự tìm nơi thực tập thành công";
      dataEmail.content = `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <p>
          Xin chào <b>${name}</b>,
          <br>
          Bạn vừa <b style="color:green"><span><span class="il">chỉnh</span></span> <span><span class="il">sửa</span></span> <span>thành</span> <span>công</span></b> thông tin <b><span>Hỗ</span> <span>trợ</span> tự tìm nơi thực tập</b>
          <br>
          Trạng thái hiện tại của dịch vụ là <b style="color:orange">Chờ kiểm tra </b>
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

      return res
        .status(200)
        .send({ message: "Sửa thông tin CV thành công!", support: support });
    }

    if (findStudent.statusCheck === 10 && support === 0) {
      await Student.findOneAndUpdate(filter, update, {
        new: true,
      });

      dataEmail.mail = email;
      dataEmail.subject = "Đăng ký thông tin tự tìm nới thực tập thành công";
      dataEmail.content = `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <p>
          Xin chào <b>${name}</b>,
          <br>
          Bạn vừa <b style="color:green"><span><span class="il">đăng</span></span> <span><span class="il">ký</span></span> <span>thành</span> <span>công</span></b> thông tin <b><span>Tự</span> <span>tìm</span> nơi thực tập</b>
          <br>
          Trạng thái hiện tại của dịch vụ là <b style="color:orange">Chờ kiểm tra </b>
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
      return res
        .status(200)
        .send({ message: "Đăng ký thông tin thành công!", support: support });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Đã xảy ra lỗi! Đăng ký lại sau ít phút!",
    });
  }
};
