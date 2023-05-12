import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import { readdirSync } from 'fs';
import semester from './src/models/semester';
require('dotenv').config();
const swaggerUI = require('swagger-ui-express');
import swaggerOptions from './src/config/swagger.config';
const app = express();
// database
mongoose.set('strictQuery', false);
mongoose
	.connect(process.env.DATABASE)
	.then(() => console.log('DB Connected'))
	.catch((error) => console.log('DB not connected ', error));
// middleware
app.use(morgan('tiny'));
app.use(express.json({ limit: '50mb' }));
app.use(cors());
// Route
readdirSync('./src/routes').map((route) => app.use('/api', require(`./src/routes/${route}`)));

app.use(express.json());

// swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerOptions));

app.use('*', (req, res) => {
	res.redirect('/api-docs');
});

let i = 0;
let y = 2021;
let time = 0;
setInterval(() => {
	time += 1;
	if (time === 365) {
		i++;
		y++;
		semester({
			name: `Spring ${y}`,
		}).save();
		i++;
		semester({
			name: `Summer ${y}`,
		}).save();
		i++;
		semester({
			name: `Fall ${y}`,
		}).save();
		time = 0;
	}
}, 86400000);

const port = process.env.PORT || 9998;

app.listen(port, () => console.log('server is listening port: ', port));
