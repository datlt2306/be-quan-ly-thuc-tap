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
        `,
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
      `,
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
        `,
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
        `,
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
        `,
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
        `,
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
        `,
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
        </div>`,
	},
};

// Tạo email mới dựa theo template
export const generateEmail = (name, email, type) => {
	const template = emailTemplates[type];

	if (!template) throw new Error(`Invalid email type: ${type}`);

	return { mail: email, subject: template.subject, content: template.content(name) };
};
