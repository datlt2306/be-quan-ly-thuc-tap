// Import dependencies
const mongoose = require('mongoose');
const differenceBy = require('lodash/differenceBy');
require('dotenv').config();
const { google } = require('googleapis');
const cron = require('node-cron');
const service = google.sheets('v4');
const credentials = require('../credentials/credentials.json');

mongoose
	.connect(process.env.DATABASE)
	.then(() => console.log('DB Connected'))
	.catch((error) => console.log('DB not connected ', error));
// // Configure auth client
const authClient = new google.auth.JWT(
	credentials.client_email,
	null,
	credentials.private_key.replace(/\\n/g, '\n'),
	['https://www.googleapis.com/auth/spreadsheets']
);

const semester = require('../models/semester');
const business = require('../models/business');
const major = require('../models/major');
const campus = require('../models/campus');
const task = cron.schedule(
	'10 * * * * *',
	async () => {
		try {
			// Authorize the client
			const token = await authClient.authorize();

			// Set the client credentials
			await authClient.setCredentials(token);

			// Get the rows
			const res = await service.spreadsheets.values.get({
				auth: authClient,
				spreadsheetId: '1Zgipf32ZOjbWAlvjNbQ81mYlAyIZiRB5acsUBRQANEk',
				range: 'A2:M',
			});

			const lastSemester = await semester.find({}).sort({ _id: -1 }).limit(1);
			const bs = await business.find();
			const mj = await major.find();
			const cp = await campus.find();
			const data2 = bs.map((item) => ({
				...item,
				code_request: item.code_request.toUpperCase(),
			}));

			// All of the data1
			const data1 = [];
			// Set rows to equal the rows
			const rows = res.data.values;
			// Check if we have any data and if we do add it to our data1 array
			if (rows.length) {
				// Remove the headers
				rows.shift();

				// For each row
				for (const row of rows) {
					if (row[11] !== 'FALSE' && row[10] !== 'FALSE')
						data1.push({
							name: row[1],
							internshipPosition: row[3],
							amount: row[4],
							address: row[2],
							description: row[5],
							request: row[6],
							code_request: row[8].toUpperCase(),
							majors: row[0],
							campus_id: row[7],
							smester_id: lastSemester[0]._id,
							status: 0,
						});
				}
				const getSecondPart = (str) => {
					return str.split('- ')[1];
				};
				data1.map((item) => {
					item.majors = getSecondPart(item.majors);
				});
				const resultBS = differenceBy(data1, data2, 'code_request');

				const removeNoneMajors = resultBS.filter(function (o1) {
					return mj.some(function (o2) {
						return o1.majors === o2.majorCode;
					});
				});

				const addMarjorId = removeNoneMajors.filter(function (o1) {
					mj.some(function (o2) {
						if (o1.majors === o2.majorCode) {
							o1.majors = o2._id;
						}
					});
					return o1;
				});

				const filterNoneCampus = addMarjorId.filter(function (o1) {
					return cp.some(function (o2) {
						return o1.campus_id === o2.name;
					});
				});

				const addCampusId = filterNoneCampus.filter(function (o1) {
					cp.some(function (o2) {
						if (o1.campus_id === o2.name) {
							o1.campus_id = o2._id;
						}
					});
					return o1;
				});
				await business.insertMany(addCampusId);
			} else {
				console.log('No data found.');
			}
		} catch (error) {
			// Log the error
			// Exit the process with error
			process.exit(1);
		}
	},
	{
		scheduled: false,
	}
);

task.start();
