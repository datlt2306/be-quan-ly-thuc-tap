export const emailTemplates = {
	CV_CHANGE_REQUEST: {
		subject: 'Thông báo sửa CV thực tập doanh nghiệp',
		content: (textNote) => /* html */ `
        <p>
          Chào em
          <br>
          Phòng Quan hệ doanh nghiệp đang kiểm tra CV của em. Bản CV của em cần sửa lại nội dung như sau:
          <br>
          ${textNote}
          <br>
           Em nhanh chóng sửa lại CV và gửi lại vào form dưới đây để Phòng QHDN gửi CV của em tới doanh nghiệp.
          <br>
          Nếu em đã tự tìm được nơi thực tập, em vui lòng cập nhật lại thông tin tại mục “Yêu cầu”.
        </p>`
	},
	RECEIVED_CV: {
		subject: 'Thông báo nhận CV sinh viên thành công',
		content: () => /* html */ `
        <p>
            Chào em,
            <br>
            Phòng Quan hệ doanh nghiệp đã nhận được CV của em và sẽ tiến hành gửi CV của em tới doanh nghiệp.
            <br>
            Em lưu ý kiểm tra email, điện thoại thường xuyên để nhận thông tin cập nhật.
            <br>
            Nếu em đã tự tìm được nơi thực tập, em vui lòng cập nhật lại thông tin tại mục “Yêu cầu”.
        </p>`
	},
	INTERN_FAILURE: {
		subject: 'Thông báo sinh viên trượt thực tập doanh nghiệp',
		content: (textNote) => /* html */ `
        <p>
            Chào em,
            <br>
            Phòng Quan hệ doanh nghiệp thông báo em đã trượt thực tập doanh nghiệp kỳ này vì lý do sau đây:
            <br>
            <i>${textNote || 'Không có'}</i>
        </p>`
	},
	RECORD_CHANGE_REQUEST: {
		subject: 'Thông báo sửa biên bản thực tập doanh nghiệp',
		content: (textNote) => /* html */ `
        <p>
            Chào em,
            <br>
            Biên bản tiếp nhận sinh viên thực tập em nộp chưa được nhận vì lý do sau đây:
            <br>
            <i>${textNote || 'Không có'}</i>  
        </p>`
	},
	RECEIVED_RECORD: {
		subject: 'Thông báo nhận biên bản sinh viên thành công',
		content: () => /* html */ `
        <p>
            Chào em,
            <br>
            Phòng Quan hệ doanh nghiệp xác nhận Biên bản tiếp nhận sinh viên thực tập của em.
            <br>
            Em lưu ý kiểm tra email, điện thoại thường xuyên để nhận thông tin cập nhật.
        </p>
        `
	},
	REPORT_CHANGE_REQUEST: {
		subject: 'Thông báo sinh viên sửa báo cáo thực tập doanh nghiệp',
		content: (textNote) => /* html */ `
        <p>
            Chào em,
            <br>
            Báo cáo thực tập của em chưa được nhận vì lý do sau đây:
            <br>
            <i>${textNote || 'Không có'}</i>
            <br>
            Em nhanh chóng sửa và nộp lại vào form dưới đây. Thời hạn nộp lại: 03 ngày.
        </p>`
	},
	INTERN_COMPLETION: {
		subject: 'Thông báo hoàn thành thông tin thực tập sinh viên thành công',
		content: () => /* html */ `
        <p>
            Chào em,<br>
            Chúc mừng em đã hoàn thành thực tập doanh nghiệp kỳ này.
            <br>
            Điểm của em sẽ được phòng QHDN cập nhật sau 1-2 ngày trên hệ thống  <a href="https://ap.poly.edu.vn/">AP</a> của trường
            <br>
            Sinh viên vui lòng đăng nhập vào trang web trang web theo đường <a href="https://thuctap.poly.edu.vn">link</a> này để xem trạng thái báo cáo
        </p>`
	},
	ACCEPTED_REQUEST: {
		subject: 'Thông báo chấp nhận yêu cầu sinh viên',
		content: (type) => /* html */ `
        <p>Chào em,
        <br>
        Phòng Quan hệ doanh nghiệp đã tiếp nhận yêu cầu sửa ${type} của em
        <br>
        Em có thể đăng nhập vào <a href="https://thuctap.poly.edu.vn/">website</a> Quản lý thực tập để sửa ${type}
    </p>`
	},
	DENIED_REQUEST: {
		subject: 'Thông báo từ chối yêu cầu sinh viên',
		content: (type, reason = 'Thời gian đăng ký đã quá hạn') => /* html */ `
            <p>Chào em,
            <br>
            Phòng Quan hệ doanh nghiệp không thể chấp nhận yêu cầu sửa ${type} của em vì lý do sau:
            <br>
            <i>${reason}</i> 
        </p>`
	}
};

// Tạo email mới dựa theo template
export const getMailTemplate = (type, ...args) => {
	const template = emailTemplates[type];
	if (!template) return;

	const content = /* html */ ` <div style="background-color: #fff; color: #212121; font-size: 16px">
		<img
			src="https://i.imgur.com/q7xM8RP.png"
			style="max-width: 160px; object-fit: cover"
			alt="logo"
			class="CToWUd" />
		<h5 style="font-size: 18px; font-weight: 600; margin-bottom: 0">Phòng Quan hệ doanh nghiệp gửi tới sinh viên</h5>
		${template.content(...args)}
        <br>
        <br>
        Thân mến.
		<hr style="width: 100%; border-bottom: 1px; border-color: #e5e7eb" />
		<span>
			Lưu ý: đây là email tự động vui lòng không phản hồi lại email này.
		</span>
	</div>`;

	return {
		subject: template.subject,
		html: content
	};
};
