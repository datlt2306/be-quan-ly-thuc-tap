export const emailTemplates = {
	INTERN_SUPPORT_REGISTRATION: {
		subject: 'Đăng ký hỗ trợ thực tập thành công',
		content: () => /* html */ `
        <p>
            Xin chào Sinh viên,
            <br>
            Bạn vừa <i>đăng ký thực tập thành công.</i>
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:#fb923c">Chờ kiểm tra</b>
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>`
	},
	INTERN_SUPPORT_UPDATE: {
		subject: 'Sửa thông tin hỗ trợ thực tập thành công',
		content: () => /* html */ `
			<p>
				Xin chào Sinh viên,
				<br />
				Bạn vừa <i>sửa thành công thông tin đăng ký thực tập.</i>
				<br />
				Trạng thái hiện tại của dịch vụ là <b style="color:#fb923c">Chờ kiểm tra</b>
				<br />
				Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh
				nghiệp
			</p>`
	},
	INTERN_SELF_FINDING_UPDATE: {
		subject: 'Sửa thông tin tự tìm nơi thực tập thành công',
		content: () => /* html */ `
        <p>
            Xin chào Sinh viên,
            <br>
            Bạn vừa <i>sửa thành công thông tin đăng ký thực tập.</i>
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:#fb923c">Chờ kiểm tra</b>
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>`
	},
	INTERN_SELF_FINDING_REGISTRATION: {
		subject: 'Đăng ký thông tin tự tìm nới thực tập thành công',
		content: () => /* html */ `
        <p>
           Xin chào Sinh viên,
            <br>
            Bạn vừa <i>đăng ký thực tập thành công.</i>
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:#34d399">Đã đăng ký</b>
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>`
	},
	UPDATED_RECORD: {
		subject: 'Sửa thông tin biên bản thành công',
		content: () => /* html */ `
        <p>
           Xin chào Sinh viên,
            <br>
            Bạn vừa <i>chỉnh sửa biên bản thành công.</i>
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:#34d399">Đã nộp biên bản</b>
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>`
	},
	RECORD_REGISTRATION: {
		subject: 'Đăng ký thông tin biên bản thành công',
		content: () => /* html */ `
        <p>
            Xin chào Sinh viên,
            <br>
            Bạn <i>đã nộp biên bản thành công.</i>
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:#34d399">Đã nộp biên bản</b>
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>`
	},
	REPORT_REGISTRATION: {
		subject: 'Thông báo nộp báo cáo thành công',
		content: () => /* html */ `
        <p>
            Xin chào Sinh viên,
            <br>
            Bạn <i>đã nộp báo cáo thành công.</i>
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:#34d399">Đã nộp báo cáo</b>
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>`
	},
	UPDATED_REPORT: {
		subject: 'Sửa thông tin báo cáo thành công',
		content: () => /* html */ `
        <p>
            Xin chào Sinh viên,
            <br>
            Bạn <i>đã sửa cáo thành công.</i>
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:#34d399">Đã nộp báo cáo </b>
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>`
	},
	CV_CHANGE_REQUEST: {
		subject: 'Thông báo sửa CV thực tập doanh nghiệp',
		content: (textNote, link) => /*html*/ `
        <p>
          Phòng QHDN yêu cầu bạn sửa lại thông tin CV
          <br>
          Lý do SV phải sửa CV: ${textNote || `Không có`}
          <br>
          Trạng thái hiện tại của dịch vụ là <b style="color:#fb923c">Sửa CV</b>
          <br>
           Sinh viên vui lòng đăng nhập vào trang web trang web theo đường <a href="${link}">link</a> để sửa CV
          <br>
          Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>`
	},
	RECEIVED_CV: {
		subject: 'Thông báo nhận CV sinh viên thành công',
		content: (link) => /*html*/ `
        <p>
            Xin chào sinh viên,
            <br>
            CV của bạn đã được phòng QHDN xác nhận.
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:#34d399">Nhận CV</b>
            <br>
            Sinh viên vui lòng đăng nhập vào trang web trang web theo đường <a href="${link}">link</a> này để xem trạng thái CV
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>`
	},
	INTERN_FAILURE: {
		subject: 'Thông báo sinh viên trượt thực tập doanh nghiệp',
		content: (textNote) => /*html*/ `
    
        <p>
            Xin chào Sinh viên,
            <br>
            Phòng QHDN thông báo: Bạn đã trượt thực tập.
            <br>
            Lý do SV trượt: ${textNote || `Không có`} <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:#f43f5e">Trượt thực tập </b>
            <br>
            Sinh viên vui long đăng ký thực tập lại vào kỳ sau trên hệ thống <a href="https://ap.poly.edu.vn/">ap.poly.edu.vn</a>
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>`
	},
	RECORD_CHANGE_REQUEST: {
		subject: 'Thông báo sửa biên bản thực tập doanh nghiệp',
		content: (textNote, link) => /*html*/ `
        <p>
            Xin chào Sinh viên,
            <br>
            Phòng QHDN yêu cầu bạn sửa lại thông tin biên bản
            <br>
            Lý do SV phải sửa báo cáo: ${textNote || `Không có`} 
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:#fb923c">Sửa biên bản </b>
            <br>
            Sinh viên vui lòng đăng nhập vào trang web trang web theo đường <a href="${link}">link</a> này để sửa biên bản
        </p>`
	},
	RECEIVED_RECORD: {
		subject: 'Thông báo nhận biên bản sinh viên thành công',
		content: (link) => /*html*/ `
        <p>
            Xin chào Sinh viên,
            <br>
            Biên bản của bạn đã được phòng QHDN xác nhận.
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:#34d399">Đang thực tập</b>
            <br>
            Sinh viên vui lòng đăng nhập vào trang web <a href="${link}">${link}</a> xem trạng thái báo cáo
        </p>

        `
	},
	REPORT_CHANGE_REQUEST: {
		subject: 'Thông báo sinh viên sửa báo cáo thực tập doanh nghiệp',
		content: (textNote, link) => /*html*/ `
        <p>
            Xin chào Sinh viên,<br>
            Phòng QHDN yêu cầu bạn sửa lại thông tin báo cáo.
            <br>
            Lý do SV phải sửa báo cáo: ${textNote || `Không có`} <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:#fb923c">Sửa báo cáo</b>
            <br>
            Sinh viên vui lòng đăng nhập vào trang web trang web theo đường <a href="${link}">link</a> này để sửa báo cáo
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>`
	},
	INTERN_COMPLETION: {
		subject: 'Thông báo hoàn thành thông tin thực tập sinh viên thành công',
		content: (link) => /* html */ `
        <p>
            Xin chào Sinh viên,<br>
            Bạn đã hoành thành thông tin thực tập.
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:mediumspring#34d399">Hoàn thành báo cáo thực tập </b>
            <br>
            Điểm của bạn sẽ được phòng QHDN cập nhật sau 1-2 ngày trên hệ thống  <a href="https://ap.poly.edu.vn/">ap.poly.edu.vn</a>
            <br>
            Sinh viên vui lòng đăng nhập vào trang web trang web theo đường <a href="${link}">link</a> này để xem trạng thái báo cáo
        </p>`
	},
	ACCEPTED_REQUEST: {
		subject: 'Thông báo chấp nhận yêu cầu sinh viên',
		content: (type, status, link) => /*html*/ `
        <p>Xin chào Sinh viên,
        <br>
        Phòng QHDN đã chấp nhận yêu cầu sửa ${type}
        <br>
        Trạng thái hiện tại của dịch vụ là <b style="color:mediumspring#34d399">${status}</b>
        <br>
        Sinh viên vui lòng đăng nhập vào trang web trang web theo đường <a href="${link}">link</a> này để sửa ${type}
    </p>`
	},
	DENIED_REQUEST: {
		subject: 'Thông báo từ chối yêu cầu sinh viên',
		content: (type, reason = 'Thời gian đăng ký đã quá hạn') => /*html*/ `
            <p>Xin chào Sinh viên,
            <br>
            Phòng QHDN không thể chấp nhận yêu cầu sửa ${type} của bạn.
            <br>
            Lý do từ chối: ${reason}
            <br>
            Vui lòng liên hệ Phòng QHDN nếu bạn cần hỗ trợ hoặc có câu hỏi.
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
		<h5 style="font-size: 18px; font-weight: 600; margin-bottom: 0">Phòng QHDN gửi tới sinh viên</h5>
		${template.content(...args)}
		<hr style="width: 100%; border-bottom: 1px; border-color: #e5e7eb" />
		<span>
			Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số
			điện thoại: <b>024.6264713</b>
		</span>
	</div>`;

	return {
		subject: template.subject,
		html: content
	};
};
