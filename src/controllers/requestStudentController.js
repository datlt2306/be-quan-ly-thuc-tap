import requestStudentToManagerModel from "../models/requestStudentToManagerModel";
import student from "../models/student";
export function getListRequestStudent (req, res) {

    

}

export async function sendRequestToManager(req, res){
    try {
          await requestStudentToManagerModel.create(req.body)
          res.status(201).json({
            success: true
          })
    } catch (error) {
        res.status(400).json({
          success: false,
          error
        })
    }
}

export async function getRequestOfStudent(req, res){
  try {
      const data = await requestStudentToManagerModel.find(req.query).populate('userId')
      res.status(200).json({
        success: true,
        data: data
      })
  } catch (err) {
    res.status(401).json({
      success: false,
      err
    })
  }
}