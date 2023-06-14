import * as googleDriveService from '../services/googleDrive.service';
import { AllowedMimeType } from '../../utils/allowFileType';
import 'dotenv/config';
import createHttpError from 'http-errors';

export const uploadFile = async (req, res) => {
	try {
		const [file] = req.files;

		if (!file) throw createHttpError.BadRequest('File must be provided!');
		if (!AllowedMimeType.includes(file.mimetype)) {
			throw createHttpError.UnprocessableEntity('File type is not allowed to upload!');
		}

		const uploadedFile = await googleDriveService.processFile(file);
		const newFile = {
			url: process.env.DRIVE_URL + uploadedFile.data.id,
			fileName: file.originalname,
			mimeType: file.mimetype
		};

		return res.status(201).json(newFile);
	} catch (error) {
		return res.status(error.status || 500).json({
			message: error.message,
			statusCode: error.status || 400
		});
	}
};
