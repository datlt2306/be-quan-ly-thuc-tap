import { OAuth2Client } from 'google-auth-library';
import createHttpError from 'http-errors';
import generateAccessToken from '../../utils/generateAccessToken';
import { HttpException } from '../../utils/httpException';
import Manager from '../models/manager.model';
import Student from '../models/student.model';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//login
export const loginGoogle = async (req, res) => {
	try {
		const { token, campus_id, smester_id } = req.body;
		if (!token) {
			return res.status(401).json({ message: 'Vui lòng đăng nhập tài khoản' });
		}
		const ticket = await client.verifyIdToken({
			idToken: token,
			requiredAudience: process.env.GOOGLE_CLIENT_ID
		});

		const { email, name, picture } = ticket.getPayload();

		const manager = await Manager.findOne({
			email: email,
			campus_id: campus_id
		});
		const student = await Student.findOne({
			email: email,
			campus_id: campus_id,
			smester_id: smester_id
		});

		if (manager) {
			const accessToken = generateAccessToken(manager);
			res.status(200).json({
				manager,
				token,
				name,
				picture,
				isAdmin: true,
				message: 'Đăng nhập thành công',
				accessToken: accessToken,
				success: true
			});
			res.status(200).json(data);
		} else if (student) {
			const accessToken = generateAccessToken(student);
			res.status(200).json({
				student,
				token,
				name,
				picture,
				isAdmin: false,
				message: 'Đăng nhập thành công',
				accessToken: accessToken,
				success: true
			});
		} else {
			res.status(400).json({ token: '', message: 'Dang nhap that bai', success: false });
		}
	} catch (error) {
		const httpException = new HttpException(error);
		res.status(httpException.statusCode).json(httpException);
	}
};

// Admin Login
export const loginAdmin = async (req, res) => {
	try {
		const { token } = req.body;
		if (!token) throw createHttpError(400, 'Chưa chuyền vào token');

		const ticket = await client.verifyIdToken({
			idToken: token,
			requiredAudience: process.env.GOOGLE_CLIENT_ID
		});

		const { email, name, picture } = ticket.getPayload();

		const manager = await Manager.findOne({
			email,
			role: 3
		});

		if (!manager) throw createHttpError(404, 'Không tìm thấy Admin');

		const accessToken = generateAccessToken(manager);
		const data = {
			manager,
			token,
			name,
			picture,
			isAdmin: true,
			message: 'Đăng nhập thành công',
			accessToken: accessToken,
			success: true
		};

		return res.status(200).json(data);
	} catch (error) {
		const httpException = new HttpException(error);
		return res.status(httpException.statusCode).json(httpException);
	}
};

// Logout
export const logout = async (req, res) => {
	try {
		res.status(201).json({
			message: 'Logout successfully',
			token: ''
		});
	} catch (error) {
		res.status(500).json({ token: '', message: 'Lỗi server' });
	}
};

//getAll
export const getManagers = async (req, res) => {
	const managers = await Manager.find();
	try {
		res.status(201).json({
			managers,
			message: 'Get all manager'
		});
	} catch (error) {
		res.status(500).json({ token: '', message: 'Lỗi server' });
	}
};
