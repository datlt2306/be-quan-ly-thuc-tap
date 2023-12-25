import Specialization from '../models/specialization.model';
export const createSpecialization = async (req, res) => {
	try {
		const specialization = await Specialization.create(req.body);
		return res.status(200).json({
			specialization,
			message: 'Create specialization successfully'
		});
	} catch (error) {
		res.status(400).json(error);
	}
};

export const getListSpecialization = async (req, res) => {
	try {
		const listSpecialization = await Specialization.find();
		return res.status(200).json({
			listSpecialization,
			message: 'Get list specialization successfully'
		});
	} catch (error) {
		return res.status(400).json(error);
	}
};
