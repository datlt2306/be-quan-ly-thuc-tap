import TokenDevice from "../models/tokenDevice";

export const getListToken = async (req, res) => {
  try {
    const tokens = await TokenDevice.find().sort({ createdAt: -1 });
    res.status(200).json({
      tokens,
      success: true,
    });
  } catch (error) {
    res.json(error);
  }
};

export const getTokenByStudentId = async (req, res) => {
  try {
    const tokenDevice = await TokenDevice.findById({
      student_id: req.params.student_id,
    });
    res.status(200).json({
      tokenDevice,
      success: true,
    });
  } catch (error) {
    res.json(error);
  }
};

export const createToken = async (req, res) => {
  try {
    const tokenDevice = await new TokenDevice(req.body).save();
    res.status(200).json({
      tokenDevice,
      success: true,
    });
  } catch (error) {
    res.json(error);
  }
};

export const updateTokenDevice = async (req, res) => {
  try {
    const tokenDevice = await TokenDevice.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({
      status: "ok",
      success: true,
      tokenDevice: tokenDevice,
      message: "Sửa thành công",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      success: false,
      msg: "Thất bại",
      data: {},
    });
  }
};

export const removeTokenDevice = async (req, res) => {
  try {
    const tokenDevice = await TokenDevice.findByIdAndRemove(req.params.id);
    res.status(200).json({
      tokenDevice,
      message: "Xóa thành công",
    });
  } catch (error) {
    res.json({
      error,
    });
  }
};
