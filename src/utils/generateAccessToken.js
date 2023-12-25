import jwt from 'jsonwebtoken';
import 'dotenv/config';

const generateAccessToken = (user) => {
	return jwt.sign({ userId: user._id, campus_id: user.campus_id }, process.env.ACCESS_TOKEN_SECRET);
};

export default generateAccessToken;
