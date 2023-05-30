import createHttpError from 'http-errors';
import businessModel from '../models/business.model';
import { businessValidation, businessListValidation } from '../validation/business.validation';

// TODO: refactor this after release
export const upsertBusinessList = async (data, semester_id, campus_id) => {
	try {
		// Tìm duplicate. Trùng tax_code & business_code = duplicate.
		const dupl = (
			await Promise.all(
				data.map(async ({ tax_code, business_code }) => {
					const checkDuplicate = await businessModel.findOne({
						$or: [{ tax_code }, { business_code }]
					});
					return checkDuplicate ? { tax_code, business_code, campus_id: checkDuplicate.campus_id } : null;
				})
			)
		).filter((_) => _);

		//* Dùng dupl để kiểm tra bản trùng.
		//* Nếu không tồn bại bản ghi nào (hoặc chỉ có ở cơ sở khác) sẽ tạo bản ghi mới
		//* Nếu đã tồn tại (ở kỳ trước) sẽ cập nhật lại thông tin
		const bulkOperations = data.map((business) => {
			const update = { ...business, semester_id: semester_id.toString(), campus_id: campus_id.toString() };
			const { error } = businessValidation(update);
			const isExist = dupl.find(({ campus_id: CID }) => CID.equals(campus_id));
			if (error) throw createHttpError(400, 'Dữ liệu không hợp lệ: ' + error.message);
			if (!isExist) return { insertOne: { document: update } };

			return { updateOne: { filter: { campus_id }, update, upsert: true } };
		});

		const result = await businessModel.bulkWrite(bulkOperations);
		const message = `Thêm mới ${result.insertedCount} doanh nghiệp. Sửa ${result.modifiedCount} doanh nghiệp. Chèn mới ${result.upsertedCount} doanh nghiệp.`;
		const isChange = result.insertedCount + result.modifiedCount + result.upsertedCount;

		return isChange ? [200, message] : [304, 'Dữ liệu không thay đổi'];
	} catch (error) {
		throw error;
	}
};
