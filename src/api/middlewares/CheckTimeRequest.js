import ConfigTime from '../models/configTime.model'

export const checkRequestTime = async (req, res, next) => {
  const { typeNumber, semester_id, checkTime, campus_id } = req.body;
  try {
    const dateNow = Date.now();
    const { startTime, endTime } = await ConfigTime.findOne({
      typeNumber,
      semester_id,
      campus_id
    });
    if (checkTime) {
      next();
    } else if (dateNow > startTime && dateNow < endTime && !checkTime) {
      next();
    } else {
      return res.status(400).json({
        message: "Hết thời gian nộp form",
      });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};
