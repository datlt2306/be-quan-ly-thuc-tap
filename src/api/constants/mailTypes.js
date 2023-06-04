/**
 * @enum
 */

const MailTypes = {
	/* REGISTRATION */
	INTERN_SUPPORT_REGISTRATION: 'INTERN_SUPPORT_REGISTRATION',
	INTERN_SUPPORT_UPDATE: 'INTERN_SUPPORT_UPDATE',
	INTERN_SELF_FINDING_UPDATE: 'INTERN_SELF_FINDING_UPDATE',
	INTERN_SELF_FINDING_REGISTRATION: 'INTERN_SELF_FINDING_REGISTRATION',
	/* CV */
	CV_CHANGE_REQUEST: 'CV_CHANGE_REQUEST',
	RECEIVED_CV: 'RECEIVED_CV',
	/* RECORD */
	RECORD_REGISTRATION: 'RECORD_REGISTRATION',
	RECORD_CHANGE_REQUEST: 'RECORD_CHANGE_REQUEST',
	UPDATED_RECORD: 'UPDATED_RECORD',
	RECEIVED_RECORD: 'RECEIVED_RECORD',
	/* REPORT */
	REPORT_REGISTRATION: 'REPORT_REGISTRATION',
	REPORT_CHANGE_REQUEST: 'REPORT_CHANGE_REQUEST',
	UPDATED_REPORT: 'UPDATED_REPORT',
	/* RESULT */
	INTERN_FAILURE: 'INTERN_FAILURE',
	INTERN_COMPLETION: 'INTERN_COMPLETION'
};

export default MailTypes;