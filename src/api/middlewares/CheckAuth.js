import Manager from '../models/manager.model';
import Student from '../models/student.model';
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const isAuthenticateUser = async (req, res, next) => {
	try {
		const authHeader = req.header('Authorization');
		const accessToken = authHeader && authHeader.split(' ')[1];
		if (!accessToken) {
			return res.status(401).json({ message: 'Vui lòng đăng nhập tài khoản' });
		}
		const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
		const admin = await Manager.findOne({ _id: decoded.userId, role: 3 });
		const manager = await Manager.findOne({
			_id: decoded.userId,
			campus_id: decoded.campus_id
		});
		const student = await Student.findOne({
			_id: decoded.userId,
			campus_id: decoded.campus_id
		});

		if (admin) {
			req.role = admin.role;
			req.bypass = true;
			next();
		} else if (manager) {
			req.role = manager.role;
			// xác nhận cơ sở của mannager

			req.campusManager = manager.campus_id;
			next();
		} else if (student) {
			// xác nhận cơ sở của student
			req.campusStudent = student.campus_id;
			req.role = 0;
			next();
		} else {
			return res.status(401).json({
				msg: 'Không có quyền truy cập'
			});
		}
	} catch (error) {
		return res.json({
			message: error
		});
	}
};

export const authorizeRoles =
	(roles, blacklist = false) =>
	(req, res, next) => {
		//* blacklist = false => ban quyền cho role truyền vào.
		//* blacklist = true => ngược lại, chỉ ban quyền cho role không truyền vào

		const isUnauthorized = (blacklist && roles.includes(req.role)) || (!blacklist && !roles.includes(req.role));
		if (isUnauthorized) return res.status(403).send('Tài khoản không có quyền truy cập');
		next();
	};
