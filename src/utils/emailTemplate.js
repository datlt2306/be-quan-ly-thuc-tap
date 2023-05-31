export const emailTemplates = {
	internshipSupportRegistered: {
		subject: 'Đăng ký hỗ trợ thực tập thành công',
		content: (name) => /*html*/ `
        <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
        <div class="adM">
        </div>
        <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
        <p>
            Xin chào <b>${name}</b>,
            <br>
            Bạn vừa <b style="color:green"><span><span class="il">đăng</span></span> <span><span class="il">ký</span></span> <span>thành</span> <span>công</span></b> thông tin <b><span>Hỗ</span> <span>trợ</span> tìm nơi thực tập</b>
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:orange">Chờ kiểm tra </b>
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>
        <hr style="border-top:1px solid">
        <div style="font-style:italic">
            <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại bên dưới</span>
            <div class="yj6qo"></div>
            <div class="adL"></div>
            <div class="adL"><br>
            </div>
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        </div>
        `
	},
	internshipSupportUpdated: {
		subject: 'Sửa thông tin hỗ trợ thực tập thành công',
		content: (name) => /*html*/ `
      <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
      <div class="adM">
      </div>
      <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
      <p>
          Xin chào <b>${name}</b>,<br>
          Bạn vừa <b style="color:green"><span><span class="il">chỉnh</span></span> <span><span class="il">sửa</span></span> <span>thành</span> <span>công</span></b> thông tin <b><span>Hỗ</span> <span>trợ</span> tìm nơi thực tập</b>
          <br>
          Trạng thái hiện tại của dịch vụ là <b style="color:orange">Chờ kiểm tra </b>
          <br>
          Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
      </p>
      <hr style="border-top:1px solid">
      <div style="font-style:italic">
          <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại bên dưới</span>
          <div class="yj6qo"></div>
          <div class="adL"></div>
          <div class="adL"><br>
          </div>
      </div>
      <div class="adL">
      </div>
      <div class="adL">
      </div>
      <div class="adL">
      </div>
      </div>
      `
	},
	selfInternshipUpdated: {
		subject: 'Sửa thông tin tự tìm nơi thực tập thành công',
		content: (name) => /*html*/ `
        <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
        <div class="adM">
        </div>
        <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
        <p>
            Xin chào <b>${name}</b>,
            <br>
            Bạn vừa <b style="color:green"><span><span class="il">chỉnh</span></span> <span><span class="il">sửa</span></span> <span>thành</span> <span>công</span></b> thông tin <b><span>Hỗ</span> <span>trợ</span> tự tìm nơi thực tập</b>
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:orange">Chờ kiểm tra </b>
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>
        <hr style="border-top:1px solid">
        <div style="font-style:italic">
            <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại bên dưới</span>
            <div class="yj6qo"></div>
            <div class="adL"></div>
            <div class="adL"><br>
            </div>
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        </div>
        `
	},
	selfInternshipRegistered: {
		subject: 'Đăng ký thông tin tự tìm nới thực tập thành công',
		content: (name) => /*html*/ `
        <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
        <div class="adM">
        </div>
        <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
        <p>
            Xin chào <b>${name}</b>,
            <br>
            Bạn vừa <b style="color:green"><span><span class="il">đăng</span></span> <span><span class="il">ký</span></span> <span>thành</span> <span>công</span></b> thông tin <b><span>Tự</span> <span>tìm</span> nơi thực tập</b>
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:orange">Chờ kiểm tra </b>
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>
        <hr style="border-top:1px solid">
        <div style="font-style:italic">
            <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại bên dưới</span>
            <div class="yj6qo"></div>
            <div class="adL"></div>
            <div class="adL"><br>
            </div>
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        </div>
        `
	},
	reportUpdated: {
		subject: 'Sửa thông tin biên bản thành công',
		content: (name) => /*html*/ `
        <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
        <div class="adM">
        </div>
        <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
        <p>
            Xin chào <b>${name}</b>,
            <br>
            Bạn vừa <b style="color:green"><span><span class="il">chỉnh</span></span> <span><span class="il">sửa</span></span> <span>thành</span> <span>công</span></b> thông tin <b><span>Biên</span> <span>bản</span></b>
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:orange">Đã nộp biên bản </b>
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>
        <hr style="border-top:1px solid">
        <div style="font-style:italic">
            <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại bên dưới</span>
            <div class="yj6qo"></div>
            <div class="adL"></div>
            <div class="adL"><br>
            </div>
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        </div>
        `
	},
	reportRegistered: {
		subject: 'Đăng ký thông tin biên bản thành công',
		content: (name) => /*html*/ `
        <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
        <div class="adM">
        </div>
        <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
        <p>
            Xin chào <b>${name}</b>,
            <br>
            Bạn vừa <b style="color:green"><span><span class="il">đăng</span></span> <span><span class="il">ký</span></span> <span>thành</span> <span>công</span></b> thông tin <b><span>Biên</span> <span>bản</span></b>
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:orange">Đã nộp biên bản </b>
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>
        <hr style="border-top:1px solid">
        <div style="font-style:italic">
            <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại bên dưới</span>
            <div class="yj6qo"></div>
            <div class="adL"></div>
            <div class="adL"><br>
            </div>
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        </div>
        `
	},
	minutesRegistered: {
		subject: 'Đăng ký thông tin báo cáo thành công',
		content: (name) => /*html*/ `
        <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
        <div class="adM">
        </div>
        <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
        <p>
            Xin chào <b>${name}</b>,
            <br>
            Bạn vừa <b style="color:green"><span><span class="il">đăng</span></span> <span><span class="il">ký</span></span> <span>thành</span> <span>công</span></b> thông tin <b><span>Báo</span> <span>cáo</span></b>
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:orange">Đã nộp báo cáo </b>
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>
        <hr style="border-top:1px solid">
        <div style="font-style:italic">
            <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại bên dưới</span>
            <div class="yj6qo"></div>
            <div class="adL"></div>
            <div class="adL"><br>
            </div>
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        </div>
        `
	},
	minutesUpdated: {
		subject: 'Sửa thông tin báo cáo thành công',
		content: (name) => /*html*/ `
        <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
        <div class="adM">
        </div>
        <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
        <p>
            Xin chào <b>${name}</b>,
            <br>
            Bạn vừa <b style="color:green"><span><span class="il">chỉnh</span></span> <span><span class="il">sửa</span></span> <span>thành</span> <span>công</span></b> thông tin <b><span>Báo</span> <span>cáo</span></b>
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:orange">Đã nộp báo cáo </b>
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>
        <hr style="border-top:1px solid">
        <div style="font-style:italic">
            <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại bên dưới</span>
            <div class="yj6qo"></div>
            <div class="adL"></div>
            <div class="adL"><br>
            </div>
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        </div>`
	},
	cvCorrectionNotif: {
		subject: 'Thông báo sửa CV thực tập doanh nghiệp',
		content: (textNote, hostname) => /*html*/ `
        <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
        <div class="adM">
        </div>
        <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
        <p>
          Phòng QHDN yêu cầu bạn sửa lại thông tin <b style="color:green"><span><span class="il">CV</span></span> <span></span></b><br>
          Lý do SV phải sửa CV: ${textNote} <br>
          Trạng thái hiện tại của dịch vụ là <b style="color:orange">Sửa CV </b>
          <br>
          Sinh vi&ecirc;n vui l&ograve;ng đăng nhập v&agrave;o trang web <a href="http://${hostname}">${hostname}</a>&nbsp;sửa CV
          <br>
          Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>
        <hr style="border-top:1px solid">
        <div style="font-style:italic">
        <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại: </span>
        <a face="arial, sans-serif" href="tel:0246264713">024 6264713</a>
            <div class="yj6qo"></div>
            <div class="adL"></div>
            <div class="adL"><br>
            </div>
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        </div>
        `
	},
	cvReceivedNotif: {
		subject: 'Thông báo nhận CV sinh viên thành công',
		content: (hostname) => /*html*/ `
        <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
        <div class="adM">
        </div>
        <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
        <p>
            Xin chào sinh viên,<br>
            CV của bạn đã được phòng QHDN <b><span>Xác</span> <span>Nhận</span></b>
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:orange">Nhận CV </b><br>
            Sinh vi&ecirc;n vui l&ograve;ng đăng nhập v&agrave;o trang web <a href="http://${hostname}">${hostname}</a>&nbsp;xem trạng thái CV
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>
        <hr style="border-top:1px solid">
        <div style="font-style:italic">
        <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại: </span>
        <a face="arial, sans-serif" href="tel:0246264713">024 6264713</a>
            <div class="yj6qo"></div>
            <div class="adL"></div>
            <div class="adL"><br>
            </div>
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        </div>
        `
	},
	failedInternshipNotif: {
		subject: 'Thông báo sinh viên trượt thực tập doanh nghiệp',
		content: (textNote) => /*html*/ `
        <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
        <div class="adM">
        </div>
        <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
        <>
            Xin chào Sinh viên,<br>
            Bạn đã trượt thực tập. Phòng QHDN <b><span>Xác</span> <span>Nhận</span></b>
            <br>
            Lý do SV trượt: ${textNote}<br>
            Trạng thái hiện tại của dịch vụ là <b style="color:orange">Trượt thực tập </b>
            <br>
            Sinh vi&ecirc;n vui l&ograve;ng đăng k&yacute; thực tập lại v&agrave;o kỳ sau tr&ecirc;n hệ thống <a href="https://ap.poly.edu.vn/">ap.poly.edu.vn</a>
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>
        <hr style="border-top:1px solid">
        <div style="font-style:italic">
             <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại: </span>
        <a face="arial, sans-serif" href="tel:0246264713">024 6264713</a>
            <div class="yj6qo"></div>
            <div class="adL"></div>
            <div class="adL"><br>
            </div>
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        </div>
        `
	},
	updateReportNotif: {
		subject: 'Thông báo sửa biên bản thực tập doanh nghiệp',
		content: (textNote, hostname) => /*html*/ `
        <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
        <div class="adM">
        </div>
        <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
        <p>
            Xin chào Sinh viên,<br>
            Phòng QHDN yêu cầu bạn sửa lại thông tin <b style="color:green"><span><span class="il">Biên</span></span> <span><span class="il">bản</span></span></b>
            <br>
            Lý do SV phải sửa báo cáo: ${textNote}
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:orange">Sửa biên bản </b>
            <br>
            Sinh vi&ecirc;n vui l&ograve;ng đăng nhập v&agrave;o trang web <a href="http://${hostname}">${hostname}</a>&nbsp;sửa biên bản
        </p>
        <hr style="border-top:1px solid">
        <div style="font-style:italic">
             <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại: </span>
        <a face="arial, sans-serif" href="tel:0246264713">024 6264713</a>
            <div class="yj6qo"></div>
            <div class="adL"></div>
            <div class="adL"><br>
            </div>
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        </div>
        `
	},
	reportReceivedNotif: {
		subject: 'Thông báo nhận biên bản sinh viên thành công',
		content: (hostname) => /*html*/ `
        <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
        <div class="adM">
        </div>
        <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
        <>
            Xin chào Sinh viên,<br>
            Biên bản của bạn đã được phòng QHDN <b><span>Xác</span> <span>Nhận</span></b>
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:orange">Đang thực tập </b>
            <br>
            Sinh vi&ecirc;n vui l&ograve;ng đăng nhập v&agrave;o trang web <a href="http://${hostname}">${hostname}</a>&nbsp;xem trạng thái báo cáo
        </p>
        <hr style="border-top:1px solid">
        <div style="font-style:italic">
             <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại: </span>
        <a face="arial, sans-serif" href="tel:0246264713">024 6264713</a>
            <div class="yj6qo"></div>
            <div class="adL"></div>
            <div class="adL"><br>
            </div>
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        </div>
        `
	},
	updateMinutesNotif: {
		subject: 'Thông báo sinh viên sửa báo cáo thực tập doanh nghiệp',
		content: (textNote, hostname) => /*html*/ `
        <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
        <div class="adM">
        </div>
        <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
        <>
            Xin chào Sinh viên,<br>
            Phòng QHDN yêu cầu bạn sửa lại thông tin <b style="color:green"><span><span class="il">Báo</span></span> <span><span class="il">cáo</span></span></b>
            <br>
            Lý do SV phải sửa báo cáo: ${textNote}<br>
            Trạng thái hiện tại của dịch vụ là <b style="color:orange">Sửa báo cáo </b><br>
            Sinh vi&ecirc;n vui l&ograve;ng đăng nhập v&agrave;o trang web <a href="http://${hostname}">${hostname}</a>&nbsp;sửa báo cáo
            <br>
            Nội dung(nếu có): Lưu ý mỗi sinh viên sẽ giới hạn 3 lần được hỗ trợ tìm nơi thực tập từ phòng quan hệ doanh nghiệp
        </p>
        <hr style="border-top:1px solid">
        <div style="font-style:italic">
             <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại: </span>
        <a face="arial, sans-serif" href="tel:0246264713">024 6264713</a>
            <div class="yj6qo"></div>
            <div class="adL"></div>
            <div class="adL"><br>
            </div>
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        </div>`
	},
	minutesReceivedNotif: {
		subject: 'Thông báo hoàn thành thông tin thực tập sinh viên thành công',
		content: (hostname) => /*html*/ `
        <div style="margin:auto;background-color:#ffffff;width:500px;padding:10px;border-top:2px solid #e37c41">
        <div class="adM">
        </div>
        <img src="https://i.imgur.com/q7xM8RP.png" width="120" alt="logo" class="CToWUd">
        <>
            Xin chào Sinh viên,<br>
            Bạn đã hoành thành thông tin thực tập. Phòng QHDN <b><span>Xác</span> <span>Nhận</span></b>
            <br>
            Trạng thái hiện tại của dịch vụ là <b style="color:orange">Hoàn thành báo cáo thực tập </b>
            <br>
            Điểm của bạn sẽ được phòng QHDN cập nhật sau 1-2 ngày trên hệ thống  <a href="https://ap.poly.edu.vn/">ap.poly.edu.vn</a>
            <br>
            Sinh vi&ecirc;n vui l&ograve;ng đăng nhập v&agrave;o trang web <a href="http://${hostname}">${hostname}</a>&nbsp;xem trạng thái báo cáo
        </p>
        <hr style="border-top:1px solid">
        <div style="font-style:italic">
             <span>Lưu ý: đây là email tự động vui lòng không phản hồi lại email này, mọi thắc mắc xin liên hệ phòng QHDN qua số điện thoại: </span>
        <a face="arial, sans-serif" href="tel:0246264713">024 6264713</a>
            <div class="yj6qo"></div>
            <div class="adL"></div>
            <div class="adL"><br>
            </div>
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        <div class="adL">
        </div>
        </div>`
	}
};

// Tạo email mới dựa theo template
export const generateEmail = (email, type, ...extraRequirements) => {
	const template = emailTemplates[type];

	if (!template) throw new Error(`Invalid email type: ${type}`);

	return { mail: email, subject: template.subject, content: template.content(...extraRequirements) };
};
