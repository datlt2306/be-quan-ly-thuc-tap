import swaggerJSDoc from 'swagger-jsdoc';
require('dotenv').config();

/**
 * @description config swagger
 */
const swaggerOptions = swaggerJSDoc({
	definition: {
		openapi: '3.0.0',
		basePath: '/api',
		servers: [
			{
				url: `http://localhost:${process.env.PORT || 8000}/api`,
				description: 'Development API'
			}
		],
		info: {
			title: 'Swagger Quản lý thông tin thực tập sinh viên Fpoly',
			version: '1.0.0',
			description:
				'Đầy là tài liệu mô tả api hệ thống CMS Quản lý thông tin đăng ký thực tập của Phòng quan hệ doanh nghiệp Fpoly.',
			contact: {
				email: 'example@gmail.com'
			}
		}
	},
	apis: ['src/docs/**/*.yaml']
});

export default swaggerOptions;
