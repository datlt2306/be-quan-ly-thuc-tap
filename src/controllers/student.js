import Student from "../models/student";
import { defaultValueStudent } from "../utils/defaultValueStudent";
import { sendMail } from "./emailController";
import semester from "../models/semester";

const ObjectId = require("mongodb").ObjectID;

//listStudent
export const listStudent = async (req, res) => {
  const { limit, page } = req.query;
  try {
    if (page && limit) {
      //getPage
      let perPage = parseInt(page);
      let current = parseInt(limit);
      if (perPage < 1 || perPage == undefined || current == undefined) {
        perPage = 1;
        current = 9;
      }
      const skipNumber = (perPage - 1) * current;
      try {
        await Student.find(req.query)
          .populate("campus_id")
          .populate("smester_id")
          .populate("business")
          .populate("majors")
          .skip(skipNumber)
          .limit(current)
          .sort({ statusCheck: 1 })
          .exec((err, doc) => {
            if (err) {
              res.status(400).json(err);
            } else {
              Student.find(req.query)
                .countDocuments({})
                .exec((count_error, count) => {
                  if (err) {
                    return res.json(count_error);
                  } else {
                    return res.status(200).json({
                      total: count ? count : 0,
                      list: doc ? doc : [],
                    });
                  }
                });
            }
          });
      } catch (error) {
        return res.status(400).json(error);
      }
    } else {
      const listStudent = await Student.find({})
        .populate("campus_id")
        .populate("smester_id")
        .populate("business")
        .populate("majors");

      return res.status(200).json({
        total: listStudent.length,
        list: listStudent,
      });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

//updateStudent
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    return res.status(200).json(student);
  } catch (error) {
    return res.status(400).json(error);
  }
};

//removeStudent
export const removeStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ id: req.params.id });
    res.json(student);
  } catch (error) {
    res.json("l???i");
  }
};

//readOneStudent
export const readOneStudent = async (req, res) => {
  const student = await Student.findOne({ _id: req.params.id })
    .populate("campus_id")
    .populate("smester_id")
    .populate("business")
    .populate("majors")
    .exec();
  res.json(student);
};

export const readStudentById = async (req, res) => {
  const student = await Student.findOne({ _id: req.params.id })
    .populate("campus_id")
    .populate("smester_id")
    .populate("business")
    .populate("majors")
    .exec();
  res.json(student);
};

//insertStudent
export const insertStudent = async (req, res) => {
  const { data, smester_id, majors, campus_id } = req.body;
  try {
    const checkStudent = await Student.find({}).limit(3);

    if (checkStudent.length > 0) {
      const listMSSV = await Student.find({ smester_id, majors, campus_id });
      if (listMSSV.length === 0) {
        await Student.insertMany(data);
      } else {
        const listMS = [];
        listMSSV.forEach((item) => {
          listMS.push(item.mssv);
        });
        const listNew = [];
        await data.forEach((item) => {
          listNew.push(item.mssv);
        });

        await Student.updateMany(
          { smester_id, majors, campus_id },
          {
            $set: {
              checkUpdate: false,
              checkMulti: false,
            },
          },
          { multi: true }
        );

        await Student.updateMany(
          {
            $and: [
              { mssv: { $in: listNew } },
              { smester_id, majors, campus_id },
            ],
          },
          {
            $set: {
              checkUpdate: true,
              checkMulti: true,
            },
          },
          { multi: true }
        );

        await Student.updateMany(
          { $and: [{ checkUpdate: false }, { smester_id, majors, campus_id }] },
          {
            $set: {
              statusCheck: 3,
              checkUpdate: true,
              checkMulti: true,
            },
          },
          { multi: true }
        );

        await Student.insertMany(data);

        await Student.updateMany(
          {
            $and: [
              { mssv: { $nin: listMS } },
              { smester_id, majors, campus_id },
            ],
          },
          {
            $set: {
              checkMulti: true,
            },
          },
          { multi: true }
        );

        await Student.deleteMany({
          $and: [{ checkMulti: false }, { smester_id, majors, campus_id }],
        });
      }

      await Student.find({ smester_id })
        .populate("campus_id")
        .populate("smester_id")
        .populate("business")
        .populate("majors")
        .limit(20)
        .sort({ statusCheck: 1 })
        .exec((err, doc) => {
          if (err) {
            res.status(400).json(err);
          } else {
            Student.find({ smester_id, majors, campus_id })
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
    } else {
      await Student.insertMany(req.body.data);
      await Student.find({ smester_id })
        .populate("campus_id")
        .populate("smester_id")
        .populate("business")
        .populate("majors")
        .limit(20)
        .sort({ statusCheck: 1 })
        .exec((err, doc) => {
          if (err) {
            res.status(400).json(err);
          } else {
            Student.find({ smester_id, majors, campus_id })
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
    res.status(400).json({
      error: "Create Student failed",
    });
    return;
  }
};

//updateReviewerStudent
export const updateReviewerStudent = async (req, res) => {
  const { listIdStudent, email } = req.body;
  try {
    const data = await Student.updateMany(
      { _id: { $in: listIdStudent } },
      {
        $set: {
          reviewer: email,
        },
      },
      { multi: true }
    );
    res.status(200).json({ listIdStudent, email });
  } catch (error) {
    res.json("L???i");
  }
};

export const updateBusinessStudent = async (req, res) => {
  const { listIdStudent, business } = req.body;
  try {
    const data = await Student.updateMany(
      { _id: { $in: listIdStudent } },
      {
        $set: {
          business: business,
        },
      },
      { multi: true }
    );
    res.status(200).json({ listIdStudent, business });
  } catch (error) {
    res.json("L???i");
  }
};

//updateStatusStudent
export const updateStatusStudent = async (req, res) => {
  const { listIdStudent, status, listEmailStudent, textNote } = req.body;
  const dataEmail = {};
  const hostname = req.get("host");
  const listIdStudents = await listIdStudent.map((id) => ObjectId(id));
  const newArr = [];
  if (listEmailStudent) {
    listEmailStudent.forEach((value) => {
      newArr.push(value.email);
    });
  }
  dataEmail.mail = newArr;

  try {
    await Student.updateMany(
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
    const listStudentChangeStatus = await Student.find({
      _id: { $in: listIdStudent },
      statusCheck: status,
      note: textNote,
    });

    if (status === 1) {
      dataEmail.subject = "Th??ng b??o s???a CV th???c t???p doanh nghi???p";
      dataEmail.content = `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <p>
        Ph??ng QHDN y??u c???u b???n s???a l???i th??ng tin <b style="color:green"><span><span class="il">CV</span></span> <span></span></b><br>
        L?? do SV ph???i s???a CV: ${textNote} <br>
        Tr???ng th??i hi???n t???i c???a d???ch v??? l?? <b style="color:orange">S???a CV </b>
        <br>
        Sinh vi&ecirc;n vui l&ograve;ng ????ng nh???p v&agrave;o trang web <a href="http://${hostname}">${hostname}</a>&nbsp;s???a CV
        <br>
        N???i dung(n???u c??): L??u ?? m???i sinh vi??n s??? gi???i h???n 3 l???n ???????c h??? tr??? t??m n??i th???c t???p t??? ph??ng quan h??? doanh nghi???p
      </p>
      <hr style="border-top:1px solid">
      <div style="font-style:italic">
      <span>L??u ??: ????y l?? email t??? ?????ng vui l??ng kh??ng ph???n h???i l???i email n??y, m???i th???c m???c xin li??n h??? ph??ng QHDN qua s??? ??i???n tho???i: </span>
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
      dataEmail.subject = "Th??ng b??o nh???n CV sinh vi??n th??nh c??ng";
      dataEmail.content = `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <p>
          Xin ch??o sinh vi??n,<br>
          CV c???a b???n ???? ???????c ph??ng QHDN <b><span>X??c</span> <span>Nh???n</span></b>
          <br>
          Tr???ng th??i hi???n t???i c???a d???ch v??? l?? <b style="color:orange">Nh???n CV </b><br>
          Sinh vi&ecirc;n vui l&ograve;ng ????ng nh???p v&agrave;o trang web <a href="http://${hostname}">${hostname}</a>&nbsp;xem tr???ng th??i CV
          <br>
          N???i dung(n???u c??): L??u ?? m???i sinh vi??n s??? gi???i h???n 3 l???n ???????c h??? tr??? t??m n??i th???c t???p t??? ph??ng quan h??? doanh nghi???p
      </p>
      <hr style="border-top:1px solid">
      <div style="font-style:italic">
      <span>L??u ??: ????y l?? email t??? ?????ng vui l??ng kh??ng ph???n h???i l???i email n??y, m???i th???c m???c xin li??n h??? ph??ng QHDN qua s??? ??i???n tho???i: </span>
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
      dataEmail.subject = "Th??ng b??o sinh vi??n tr?????t th???c t???p doanh nghi???p";
      dataEmail.content = `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <>
          Xin ch??o Sinh vi??n,<br>
          B???n ???? tr?????t th???c t???p. Ph??ng QHDN <b><span>X??c</span> <span>Nh???n</span></b>
          <br>
          L?? do SV tr?????t: ${textNote}<br>
          Tr???ng th??i hi???n t???i c???a d???ch v??? l?? <b style="color:orange">Tr?????t th???c t???p </b>
          <br>
          Sinh vi&ecirc;n vui l&ograve;ng ????ng k&yacute; th???c t???p l???i v&agrave;o k??? sau tr&ecirc;n h??? th???ng <a href="https://ap.poly.edu.vn/">ap.poly.edu.vn</a>
          <br>
          N???i dung(n???u c??): L??u ?? m???i sinh vi??n s??? gi???i h???n 3 l???n ???????c h??? tr??? t??m n??i th???c t???p t??? ph??ng quan h??? doanh nghi???p
      </p>
      <hr style="border-top:1px solid">
      <div style="font-style:italic">
           <span>L??u ??: ????y l?? email t??? ?????ng vui l??ng kh??ng ph???n h???i l???i email n??y, m???i th???c m???c xin li??n h??? ph??ng QHDN qua s??? ??i???n tho???i: </span>
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
      dataEmail.subject = "Th??ng b??o s???a bi??n b???n th???c t???p doanh nghi???p";
      dataEmail.content = `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <p>
          Xin ch??o Sinh vi??n,<br>
          Ph??ng QHDN y??u c???u b???n s???a l???i th??ng tin <b style="color:green"><span><span class="il">Bi??n</span></span> <span><span class="il">b???n</span></span></b>
          <br>
          L?? do SV ph???i s???a b??o c??o: ${textNote}
          <br>
          Tr???ng th??i hi???n t???i c???a d???ch v??? l?? <b style="color:orange">S???a bi??n b???n </b>
          <br>
          Sinh vi&ecirc;n vui l&ograve;ng ????ng nh???p v&agrave;o trang web <a href="http://${hostname}">${hostname}</a>&nbsp;s???a bi??n b???n
      </p>
      <hr style="border-top:1px solid">
      <div style="font-style:italic">
           <span>L??u ??: ????y l?? email t??? ?????ng vui l??ng kh??ng ph???n h???i l???i email n??y, m???i th???c m???c xin li??n h??? ph??ng QHDN qua s??? ??i???n tho???i: </span>
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
      dataEmail.subject = "Th??ng b??o nh???n bi??n b???n sinh vi??n th??nh c??ng";
      dataEmail.content = `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <>
          Xin ch??o Sinh vi??n,<br>
          Bi??n b???n c???a b???n ???? ???????c ph??ng QHDN <b><span>X??c</span> <span>Nh???n</span></b>
          <br>
          Tr???ng th??i hi???n t???i c???a d???ch v??? l?? <b style="color:orange">??ang th???c t???p </b>
          <br>
          Sinh vi&ecirc;n vui l&ograve;ng ????ng nh???p v&agrave;o trang web <a href="http://${hostname}">${hostname}</a>&nbsp;xem tr???ng th??i b??o c??o
      </p>
      <hr style="border-top:1px solid">
      <div style="font-style:italic">
           <span>L??u ??: ????y l?? email t??? ?????ng vui l??ng kh??ng ph???n h???i l???i email n??y, m???i th???c m???c xin li??n h??? ph??ng QHDN qua s??? ??i???n tho???i: </span>
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
      dataEmail.subject =
        "Th??ng b??o sinh vi??n s???a b??o c??o th???c t???p doanh nghi???p";
      dataEmail.content = `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <>
          Xin ch??o Sinh vi??n,<br>
          Ph??ng QHDN y??u c???u b???n s???a l???i th??ng tin <b style="color:green"><span><span class="il">B??o</span></span> <span><span class="il">c??o</span></span></b>
          <br>
          L?? do SV ph???i s???a b??o c??o: ${textNote}<br>
          Tr???ng th??i hi???n t???i c???a d???ch v??? l?? <b style="color:orange">S???a b??o c??o </b><br>
          Sinh vi&ecirc;n vui l&ograve;ng ????ng nh???p v&agrave;o trang web <a href="http://${hostname}">${hostname}</a>&nbsp;s???a b??o c??o
          <br>
          N???i dung(n???u c??): L??u ?? m???i sinh vi??n s??? gi???i h???n 3 l???n ???????c h??? tr??? t??m n??i th???c t???p t??? ph??ng quan h??? doanh nghi???p
      </p>
      <hr style="border-top:1px solid">
      <div style="font-style:italic">
           <span>L??u ??: ????y l?? email t??? ?????ng vui l??ng kh??ng ph???n h???i l???i email n??y, m???i th???c m???c xin li??n h??? ph??ng QHDN qua s??? ??i???n tho???i: </span>
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
      dataEmail.subject =
        "Th??ng b??o Ho??n th??nh th??ng tin th???c t???p sinh vi??n th??nh c??ng";
      dataEmail.content = `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <>
          Xin ch??o Sinh vi??n,<br>
          B???n ???? ho??nh th??nh th??ng tin th???c t???p. Ph??ng QHDN <b><span>X??c</span> <span>Nh???n</span></b>
          <br>
          Tr???ng th??i hi???n t???i c???a d???ch v??? l?? <b style="color:orange">Ho??n th??nh b??o c??o th???c t???p </b>
          <br>
          ??i???m c???a b???n s??? ???????c ph??ng QHDN c???p nh???t sau 1-2 ng??y tr??n h??? th???ng  <a href="https://ap.poly.edu.vn/">ap.poly.edu.vn</a>
          <br>
          Sinh vi&ecirc;n vui l&ograve;ng ????ng nh???p v&agrave;o trang web <a href="http://${hostname}">${hostname}</a>&nbsp;xem tr???ng th??i b??o c??o
      </p>
      <hr style="border-top:1px solid">
      <div style="font-style:italic">
           <span>L??u ??: ????y l?? email t??? ?????ng vui l??ng kh??ng ph???n h???i l???i email n??y, m???i th???c m???c xin li??n h??? ph??ng QHDN qua s??? ??i???n tho???i: </span>
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
    return res.json({ listStudentChangeStatus, status });
  } catch (error) {
    res.json("L???i");
  }
};

//listStudentAssReviewer
// export const listStudentAssReviewer = async (req, res) => {
//   const { emailReviewer } = req.query;
//   try {
//     const listStudentAssReviewer = await Student.find({
//       reviewer: emailReviewer,
//     });
//     res.status(200).json(listStudentAssReviewer);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// };

//listStudentReviewForm
export const listStudentReviewForm = async (req, res) => {
  try {
    const listStudentReviewForm = await Student.find({
      CV: { $ne: null },
      statusCheck: 2,
    })
      .populate("campus_id")
      .populate("smester_id")
      .populate("business")
      .populate("majors");

    res.status(200).json(listStudentReviewForm);
  } catch (error) {
    res.status(400).json(error);
  }
};

//listStudentReviewCV
export const listStudentReviewCV = async (req, res) => {
  try {
    const listStudentReviewCV = await Student.find({
      CV: { $ne: null },
      form: null,
      report: null,
      statusCheck: { $in: [0, 1] },
    })
      .populate("campus_id")
      .populate("smester_id")
      .populate("business")
      .populate("majors");

    res.status(200).json(listStudentReviewCV);
  } catch (error) {
    res.status(400).json(error);
  }
};

//resetStatusStudent

export const resetStatusStudent = async (req, res) => {
  try {
    const isStudent = await Student.findOne({ _id: req.params.id });
    const defaultSemester = await semester.findOne({
      $and: [
        { start_time: { $lte: new Date() } },
        { date_time: { $gte: new Date() } },
      ],
    });
    if (!defaultSemester) {
      return res.status(200).json({
        message: "Reset th???t b???i , kh??ng n???m trong k??? hi???n t???i",
      });
    }
    if(isStudent.smester_id.toString() !== defaultSemester._id.toString()){
      return res.status(200).json({
        message: "Reset th???t b???i , kh??ng n???m trong k??? hi???n t???i",
      });
    }
    if (isStudent) {
      try {
        await Student.findOneAndUpdate(
          { _id: req.params.id },
          defaultValueStudent,
          { new: true }
        );
        return res.status(200).json({
          message:
            "Reset th??ng tin v?? tr???ng th??i th???c t???p c???a sinh vi??n th??nh c??ng",
        });
      } catch (error) {
        return res.status(402).json({
          message: "Reset kh??ng th??nh c??ng",
        });
      }
    } else {
      return res.status(402).json({
        message: "Sinh vi??n kh??ng t???n t???i",
      });
    }
  } catch (error) {
    return res.status(402).json(error);
  }
};
