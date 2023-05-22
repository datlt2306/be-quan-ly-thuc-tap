import createHttpError from 'http-errors';
import businessModel from '../models/business.model';
import { businessValidation, businessListValidation } from '../validation/business.validation';

export const upsertBusinessList = async (data, semester_id, campus_id) => {
	const options = { upsert: true, new: true };

	const bulkOperations = data.map((business) => {
		const filter = { name: business.name };
		const semester_id = semester_id || business.semester_id;
		const campus_id = campus_id || business.campus_id;
		const newData = { ...business, semester_id, campus_id };

		const { error } = businessValidation.validate(newData);
		const update = { $set: newData };

		if (error) throw createHttpError.BadRequest('Dữ liệu không đúng định dạng');

		return { updateOne: { filter, update, upsert: options.upsert } };
	});

	try {
		const result = await businessModel.bulkWrite(bulkOperations);
		const message = `${result.insertedCount} businesses inserted. ${result.modifiedCount} businesses modified. ${result.upsertedCount} businesses upserted.`;

		return { message, result };
	} catch (error) {
		console.error('Error upserting businesses:', error);
		throw error;
	}
};
