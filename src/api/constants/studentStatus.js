/**
 * @enum
 */
export const StudentStatusEnum = {
	0: 'Chờ kiểm tra CV',
	1: 'Sửa lại CV',
	2: 'Nhận CV',
	3: 'Không đủ điều kiện',
	4: 'Đã nộp biên bản',
	5: 'Sửa biên bản',
	6: 'Đang thực tập',
	7: 'Đã nộp báo cáo',
	8: 'Sửa báo cáo',
	9: 'Hoàn thành',
	10: 'Chưa đăng ký',
	11: 'Đã đăng ký',
	12: 'Không đạt'
};

/**@enum */
export const StudentStatusCodeEnum = {
	WAITING_FOR_CV_CHECK: 0,
	REVISE_CV: 1,
	RECEIVE_CV: 2,
	NOT_QUALIFIED: 3,
	SUBMITTED_REPORT: 4,
	REVISE_REPORT: 5,
	INTERNSHIP: 6,
	SUBMITTED_REPORT: 7,
	REVISE_REPORT: 8,
	COMPLETED: 9,
	NOT_REGISTERED: 10,
	REGISTERED: 11,
	NOT_PASS: 12
};

export const StudentColumnAccessors = {
	index: 'STT',
	name: 'Họ tên',
	mssv: 'MSSV',
	email: 'Email',
	phoneNumber: 'Số điện thoại',
	course: 'Khóa nhập học',
	majorCode: 'Mã ngành',
	support: 'Hình thức',
	statusCheck: 'Trạng thái thực tập',
	statusStudent: 'Trạng thái sinh viên',
	nameCompany: 'Công ty thực tập',
	addressCompany: 'Địa chỉ công ty',
	taxCode: 'Mã số thuế',
	dream: 'Vị trí thực tập',
	position: 'Vị trí người tiếp nhận',
	CV: 'CV',
	report: 'Báo cáo TT',
	form: 'Biên bản TT',
	resultScore: 'Điểm kết quả',
	attitudePoint: 'Điểm thái độ',
	reviewer: 'Reviewer',
	createdAt: 'Ngày bổ sung',
	note: 'Ghi chú'
};

export const StudentSchoolingStatus = {
	CHO: 'Chờ xếp lớp',
	HDI: 'Học đi',
	HL: 'Học lại',
	TN: 'Tốt nghiệp'
};
