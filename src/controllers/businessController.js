import business, { findByIdAndUpdate, insertMany } from "../models/business";
import Student from "../models/student";
import semester from "../models/semester";

//insertBusiness
export const insertBusiness = async (req, res) => {
  try {
    await business.insertMany(req.body);
    await business
      .find(req.query)
      .populate("campus_id")
      .populate("smester_id")
      .populate("majors")
      .sort({ createdAt: -1 })
      .exec((err, doc) => {
        if (err) {
          res.status(400).json(err);
        } else {
          business
            .find(req.query)
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
  } catch (error) {
    res.status(400).json({
      error: "Create business failed",
    });
    return;
  }
};

export const listBusiness = async (req, res) => {
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
        await business
          .find(req.query)
          .populate("campus_id")
          .populate("smester_id")
          .populate("majors")
          .skip(skipNumber)
          .limit(current)
          .exec((err, doc) => {
            if (err) {
              res.status(400).json(err);
            } else {
              business
                .find(req.query)
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
      } catch (error) {
        res.status(400).json(error);
      }
    } else {
      const listBusiness = await business
        .find(req.query)
        .populate("campus_id")
        .populate("smester_id")
        .populate("majors");
      res.status(200).json({
        total: listBusiness.length,
        list: listBusiness,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//delete business
export const removeBusiness = async (req, res) => {
  try {
    const isStudentOfBusiness = await Student.findOne({
      business: req.params.id,
    });
console.log(isStudentOfBusiness)
    if (isStudentOfBusiness) {
      return res.status(200).json({
        message: "Doanh nghi???p ??ang ???????c sinh vi??n ????ng k?? kh??ng th??? x??a.",
        success: false,
      });
    } else {
      const itemDelete = await business.findByIdAndRemove(req.params.id);
      return res.status(200).json({
        itemDelete,
        message: "X??a doanh nghi???p th??nh c??ng",
        success: true,
      });
    }
  } catch (error) {
    return res.json({
      error,
      success: false,
    });
  }
};

//create business

export const createbusiness = async (req, res) => {
  const { code_request, smester_id, campus_id } = req.body;
  try {
    const defaultSemester = await semester.findOne({
      $and: [
        { start_time: { $lte: new Date() } },
        { date_time: { $gte: new Date() } },
      ],
    });

    const Business = await business.find({
      smester_id: smester_id,
      campus_id: campus_id,
    });

    const isBusinessCodeRequest = Business.some((item) => {
      return item.code_request.includes(code_request);
    });

    if (isBusinessCodeRequest) {
      return res.status(200).json({
        message: "M?? doanh nghi???p ???? t???n t???i kh??ng th??? t???o m???i",
        success: false,
      });
    } else {
      const newBusiness = await business.create({
        ...req.body,
        smester_id: defaultSemester._id,
      });
      return res.status(200).json({
        newBusiness,
        message: "T???o doanh nghi???p th??nh c??ng",
        success: true,
      });
    }
  } catch (error) {
    return res.json({
      error,
      success: false,
    });
  }
};

//update Business

export const updateBusiness = async (req, res) => {
  const { code_request, smester_id, campus_id } = req.body;

  try {

    const defaultSemester = await semester.findOne({
      $and: [
        { start_time: { $lte: new Date() } },
        { date_time: { $gte: new Date() } },
      ],
    });

    const Business = await business.find({
      smester_id: smester_id,
      campus_id: campus_id,
    });
    
    if (defaultSemester._id.toString() !== smester_id) {
      return res.status(200).json({
        message: "Kh??ng th??? s???a doanh nghi???p do kh??ng ??? k??? hi???n t???i",
        success: false,
      });
    }
    
    const listBusiness =  Business.filter((item) => {
      return item.code_request !== code_request;
    });
    
    const isBusinessCodeRequest =  listBusiness.some((item) => {
      if(item.code_request){
        return item.code_request.includes(code_request);
      }
    });

    if (isBusinessCodeRequest) {
      return res.status(200).json({
        message: "M?? doanh nghi???p ???? t???n t???i kh??ng th??? t???o s???a",
        success: false,
      });
    } else {
      const itemBusinessUpdate = await business.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      return res.status(200).json({
        itemBusinessUpdate,
        message: "S???a doanh nghi???p th??nh c??ng",
        success: true,
      });
    }
  } catch (error) {
    return res.json({
      error,
      success: false,
    });
  }
};

export const getBusiness = async (req, res) => {
  try {
    const itemBusiness = await business.findById(req.params.id);
    return res.status(200).json({
      itemBusiness,
      success: true,
    });
  } catch (error) {
    return res.status(200).json({
      error,
      success: false,
    });
  }
};
