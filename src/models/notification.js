const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const notificationSchema = mongoose.Schema({
  student_id: {
    type: ObjectId,
    ref: 'Student'
  },
  note: {
    type: String,
  },
  title: {
    type: String
  },
  tokenDeviceId: {
    type: ObjectId,
    ref: 'tokenDevices'
  },
  icon: {
    type: String,
    default: 'https://i.pinimg.com/originals/a6/c2/54/a6c254d400f5c54256a21340b9fa94aa.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("notifications", notificationSchema);
