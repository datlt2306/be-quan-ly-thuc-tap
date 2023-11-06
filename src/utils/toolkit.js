// Thay thế các tên biến trong content mail
export const replaceContentMail = (content, data) => {
	const keys = Object.keys(data);
	let newContent = content;
	keys.forEach((key) => {
		const variable = '${' + key + '}';
		const check = content.includes(variable);
		if (check) {
			newContent = newContent.replaceAll('${' + key + '}', data[key]);
		}
	});
	return newContent;
};

/**
 * @param {File} file
 */
export default function getFileExtension(file) {
	if (!file) return null;
	const fileExtension = file.originalname.split('.').pop();
	return fileExtension.trim().toLowerCase();
}
