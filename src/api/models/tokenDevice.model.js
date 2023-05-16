const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const tokenDeviceSchema = mongoose.Schema({
  student_id: {
    type: ObjectId,
    ref: 'Student'
  },
  tokens: [
    {
        token: {
            type: 'String'
        },
        os: {
            type: 'String',
            default: 'android'
        }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

module.exports = mongoose.model("tokenDevices", tokenDeviceSchema);
