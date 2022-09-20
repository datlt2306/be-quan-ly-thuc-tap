import Notification from "../models/notification";
import axios from "axios";
export const getListNotificationByStudentId = async (req, res) => {
  try {
    const notifictions = await Notification.find({
      student_id: req.params.student_id,
    });
    res.status(200).json({
      notifictions,
      success: true,
    });
  } catch (error) {
    res.json(error);
  }
};

export const createNotification = async (req, res) => {
  try {
    const notification = await new Notification(req.body).save();
    res.status(200).json({
      notification,
      success: true,
    });
  } catch (error) {
    res.json(error);
  }
};

export const removeNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndRemove(req.params.id);
    res.status(200).json({
      notification,
      message: "Xóa thành công",
    });
  } catch (error) {
    res.json({
      error,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { title, note, registration_ids, imageUrl } = req.body;
    var data = JSON.stringify({
      data: {},
      notification: {
        title: `[Phòng QHDN] - ${title}`,
        body: note,
        imageUrl,
      },
      registration_ids: registration_ids,
    });

    var config = {
      method: "POST",
      url: "https://fcm.googleapis.com/fcm/send",
      headers: {
        Authorization:
          "Bearer AAAAGw5c0yk:APA91bHTAmnNmAXcQ62WyHZtMMX0-8i7LYXC79hcaJ9_txV4wOe5gy-DVVeWwpW5rnh4JMUvrPMNXAWeLno97xYs7f5RVdyLXd_nKwUhF5Xro_VzwbK0Hxn-N3fLR3ea3OVn2OryEM7X",
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        res.status(200).json({
          success: true,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log("áddsadasdas231312321");
    res.json({
      error,
    });
  }
};
