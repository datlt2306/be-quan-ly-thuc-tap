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

export function toCapitalize(value) {
	if (!value || typeof value === 'undefined') throw new Error('"value" cannot be empty');
	value = value.trim().replace(/\s+/g, ' ');
	const subString = value.split(' ');
	const result = subString.map((str) => str.at(0)?.toUpperCase() + str.slice(1).toLowerCase()).join(' ');
	return result;
}
