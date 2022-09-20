const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const RequestStudentToManagerModel = mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "Student",
  },
  description: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "RequestStudentToManagerModel",
  RequestStudentToManagerModel
);
