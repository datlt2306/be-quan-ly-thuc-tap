import { defaultCvStudent, defaultForm, defaultReport } from '../../utils/defaultValueStudent';
import StudentRequestModel from '../models/studentRequest.model';
import Student from '../models/student.model';
export function getListRequestStudent(req, res) {}

export async function sendRequestToManager(req, res) {
	const findRequest = await StudentRequestModel.findOne({
		userId: req.body.userId
	});

	try {
		if (findRequest && findRequest.type === req.body.type) {
			return res.status(400).json({
				success: false,
				message: 'Yêu cầu đã tồn tại'
			});
		} else {
			await StudentRequestModel.create(req.body);
			res.status(201).json({
				success: true,
				message: 'Thành công'
			});
		}
	} catch (error) {
		res.status(400).json({
			success: false,
			error,
			message: 'Có lỗi xảy ra'
		});
	}
}

export async function getRequestOfStudent(req, res) {
	try {
		const data = await StudentRequestModel.find(req.query).populate('userId');
		res.status(200).json({
			success: true,
			data: data
		});
	} catch (err) {
		res.status(401).json({
			success: false,
			err
		});
	}
}

export async function resetStudent(req, res) {
	const { type, id, useId } = req.body;
	let valueReset = {};
	if (type === process.env.cv) {
		valueReset = defaultCvStudent;
	}
	if (type === process.env.form) {
		valueReset = defaultForm;
	}
	if (type === process.env.report) {
		valueReset = defaultReport;
	}

	try {
		Student.findOneAndUpdate({ _id: req.params.id }, valueReset, { new: true })
			.then((r) =>
				StudentRequestModel.findByIdAndUpdate(
					id,
					{
						status: 2
					},
					{ new: true }
				)
			)
			.then((r) =>
				res.status(200).json({
					success: true,
					message: 'Thành công'
				})
			);
	} catch (error) {
		res.status({
			success: false,
			message: 'Có lỗi sảy ra'
		});
	}
}

export async function cancelResetStudent(req, res) {
	try {
		await StudentRequestModel.findByIdAndUpdate(req.params.id, {
			status: 3
		});

		res.status(200).json({
			success: true,
			message: 'Thành công'
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: 'Thất bại'
		});
	}
}
