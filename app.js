import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import { readdirSync } from 'fs';
import semester from './src/models/semester';
require('dotenv').config();
const swaggerUI = require('swagger-ui-express');
import swaggerOptions from './src/config/swagger.config';
import { jobScheduler } from './src/cronjobs';
const app = express();
// database
mongoose.set('strictQuery', false);
mongoose
	.connect(process.env.DATABASE)
	.then(() => {
		// cronjob
		// if(process.env.NODE_ENV === 'production')
		jobScheduler.init();
		console.log('DB Connected');
	})
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

const port = process.env.PORT || 9998;

app.listen(port, () => console.log('server is listening port: ', port));
