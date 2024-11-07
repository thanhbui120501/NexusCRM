export default function LoginValidation(values) {
    const errors = {
        status: true,
    };

    if (values.username === "") {
        errors.username = "Vui lòng nhập tên đăng nhập";
        errors.status = false;
    }

    if (values.password === "") {
        errors.password = "Vui lòng nhập mật khẩu";
        errors.status = false;
    }

    return errors;
}

export function Validation({
    image = null,
    username = null,
    password = null,
    fullname = null,
    birthDay = null,
    email = null,
    phone = null,
    listUsername = [],
    listEmail = [],
    listPhoneNumber = [],
    type = null,
}) {
    const errors = {
        status: true,
    };

    //type is create then validate username, image
    if (type === "create") {
        //validate username
        if (username == null || username === "") {
            errors.username = "Vui lòng điền tên tài khoản.";
            errors.status = false;
        } else {
            const usernameRegex = /^[a-zA-Z0-9._-]{5,20}$/;
            if (!usernameRegex.test(username)) {
                errors.username =
                    "Tên đăng nhập phải từ 5-20 kí tự,gồm số, chữ cái hoa, thường và (._-).";
                errors.status = false;
            }
            if (listUsername.some((data) => data.username === username)) {
                errors.username = "Tên đăng nhập đã tồn tại.";
                errors.status = false;
            }
        }
        //validate image
        if (image === null) {
            errors.image = "Vui lòng chọn ảnh.";
            errors.status = false;
        }
        //validate password is null
        if (password == null || password === "") {
            errors.password = "Vui lòng nhập mật khẩu.";
            errors.status = false;
        }
    }

    //validate password
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$#%!@]).{6,14}$/;
    if (!passwordRegex.test(password) && password != "") {
        errors.password =
            "Mật khẩu phải từ 6-14 kí tự, tối thiểu 1 kí tự hoa, thường, số và ($,#,!,@).";
        errors.status = false;
    }

    //validate full name
    if (fullname == null || fullname === "") {
        errors.fullname = "Vui nhập họ và tên";
        errors.status = false;
    } else {
        const fullnameRegex = /^(?=.*[a-zA-Z])(?!.*\d).{3,100}$/;
        if (!fullnameRegex.test(fullname)) {
            errors.fullname =
                "Họ tên phải từ 3-100 kí tự và chỉ bao gồm các chữ cái.";
            errors.status = false;
        }
    }

    //validate birthday
    if (birthDay == null || birthDay === "") {
        errors.birthDay = "Vui lòng chọn ngày sinh";
        errors.status = false;
    } else {
        const today = new Date();
        if (birthDay >= today) {
            errors.birthDay = "Ngày sinh không hợp lệ";
            errors.status = false;
        }
    }
    //validate email
    if (email == null || email === "") {
        errors.email = "Vui lòng nhập địa chỉ email";
        errors.status = false;
    } else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            errors.email = "Email không đúng định dạng";
            errors.status = false;
        }
        if (listEmail.some((data) => data.email === email)) {
            errors.email = "Email đã tồn tại.";
            errors.status = false;
        }
    }
    //validate phone number
    if (phone == null || phone === "") {
        errors.phone = "Vui lòng nhập số điện thoại.";
        errors.status = false;
    } else {
        const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
        if (!phoneRegex.test(phone)) {
            errors.phone = "Số điện thoại không đúng.";
            errors.status = false;
        }
        if (listPhoneNumber.some((data) => data.phone_number === phone)) {
            errors.phone = "Số điện thoại đã tồn tại.";
            errors.status = false;
        }
    }
    return errors;
}

export function CustomerValidation({
    image,
    fullname = null,
    birthDay = null,
    email = null,
    phone = null,
    listPhoneNumber = [],
    listEmail = [],
}) {
    const errors = {
        status: true,
    };
    if (image == null) {
        //validate image
        if (image === null) {
            errors.image = "Vui lòng chọn ảnh.";
            errors.status = false;
        }
    }
    //validate full name
    if (fullname == null || fullname === "") {
        errors.fullname = "Vui nhập họ và tên";
        errors.status = false;
    } else {
        const fullnameRegex = /^(?=.*[a-zA-Z])(?!.*\d).{3,100}$/;
        if (!fullnameRegex.test(fullname)) {
            errors.fullname =
                "Họ tên phải từ 3-100 kí tự và chỉ bao gồm các chữ cái.";
            errors.status = false;
        }
    }

    //validate birthday
    if(birthDay === ""){
        errors.birthDay = "Vui lòng chọn ngày sinh";
        errors.status = false;
    }else{
        const today = new Date();
        if (birthDay >= today) {
            errors.birthDay = "Ngày sinh không hợp lệ";
            errors.status = false;
        }
    }
    
    //validate email
    if (email == null || email === "") {
        errors.email = "Vui lòng nhập địa chỉ email";
        errors.status = false;
    } else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            errors.email = "Email không đúng định dạng";
            errors.status = false;
        }
        if (listEmail.some((data) => data.email === email)) {
            errors.email = "Email đã tồn tại.";
            errors.status = false;
        }
    }

    //validate phone number
    if (phone == null || phone === "") {
        errors.phone = "Vui lòng nhập số điện thoại.";
        errors.status = false;
    } else {
        const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
        if (!phoneRegex.test(phone)) {
            errors.phone = "Số điện thoại không đúng.";
            errors.status = false;
        }
        if (listPhoneNumber.some((data) => data.phone_number === phone)) {
            errors.phone = "Số điện thoại đã tồn tại.";
            errors.status = false;
        }
    }
    return errors;
}
