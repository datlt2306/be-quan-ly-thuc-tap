import createHttpError from 'http-errors';
import { PassThrough } from 'stream';
import { drive } from '../../config/googleAPI.config';
import { AllowedMimeType } from '../../utils/allowFileType';
import 'dotenv/config';

// Lấy & xử lý file
export const processFile = async (unprocessedFile) => {
	try {
		/* Tạo nơi lưu trữ file tạm thời (buffer) -> đọc file qua stream */
		const bufferStream = new PassThrough();

		bufferStream.end(unprocessedFile.buffer);

		const createdFile = await drive.files.create({
			requestBody: {
				name: unprocessedFile.originalname,
				parents: [process.env.FOLDER_ID]
			},
			/* file được upload lấy từ buffer đã được lưu trữ tạm thời trước đó */
			media: {
				body: bufferStream
			},
			fields: 'id'
		});

		await setFilePublic(createdFile.data.id);

		return createdFile;
	} catch (error) {
		throw createHttpError(500, error.message);
	}
};

// Public access
export const setFilePublic = async (fileId) => {
	try {
		await drive.permissions.create({
			fileId,
			requestBody: {
				role: 'reader',
				type: 'anyone'
			}
		});

		return drive.files.get({
			fileId,
			fields: 'webViewLink, webContentLink'
		});
	} catch (error) {
		throw createHttpError(500, error.message);
	}
};

// Delete file on google drive
export const deleteFile = async (fileId) => {
	try {
		return await drive.files.delete({ fileId });
	} catch (error) {
		return Promise.resolve(error); // ignore error after delete file on google drive successfully
	}
};

export const uploadFile = async (file) => {
	try {
		if (!file) throw new Error('File must be provided!');
		if (!AllowedMimeType.includes(file.mimetype))
			throw createHttpError.UnsupportedMediaType('File type is not allowed to upload!');
		const uploadedFile = await processFile(file);
		const newFile = {
			url: process.env.DRIVE_URL + uploadedFile.data.id,
			fileName: file.originalname,
			mimeType: file.mimetype
		};

		return newFile;
	} catch (error) {
		throw createHttpError.UnprocessableEntity(error.message);
	}
};

// get google drive file id from URL link
export const extractFileID = (link) => {
	if (!link) return null;
	const match = link.match(/\/d\/([a-zA-Z0-9-_]+)/);
	return match ? match[1] : null;
};
