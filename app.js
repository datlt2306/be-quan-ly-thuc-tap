import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { readdirSync } from 'fs';
import mongoose from 'mongoose';
import morgan from 'morgan';
import swaggerOptions from './src/config/swagger.config';
import { jobScheduler } from './src/cronjobs';
require('dotenv').config();
const swaggerUI = require('swagger-ui-express');

const app = express();
// database
mongoose.set('strictQuery', false);
mongoose
	.connect(process.env.DATABASE)
	.then(() => {
		// cronjob
		jobScheduler.init();
		console.log('DB Connected');
	})
	.catch((error) => console.log('DB not connected ', error));
// middleware
app.use(morgan('tiny'));
app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(compression({ level: 6, threshold: 1 * 1024 })); // compress data if payload is too large
// Route
readdirSync('./src/api/routes').map((route) => app.use('/api', require(`./src/api/routes/${route}`)));

app.use(express.json());

// swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerOptions));
app.use('*', (req, res) => {
	res.redirect('/api-docs');
});

const port = process.env.PORT || 9998;

app.listen(port, () => console.log('server is listening port: ', port));
