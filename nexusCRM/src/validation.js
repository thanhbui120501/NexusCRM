export default function Validation(values){
    const errors = {       
        status:true
    }

    //const email_parttern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,6}$/;

    //const password_partten = /^.*(?=.{3,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\d\x])(?=.*[!$#%]).*$/;

    if(values.username === ""){
        errors.username = "Vui lòng nhập tên đăng nhập";
        errors.status = false;
    }

    // if(values.email === ""){
    //     errors.email = "Vui lòng nhập email";
    // }else if(!email_parttern.test(values.email)){
    //     errors.email = "Email không đúng định dạng";
    // }
    
    if(values.password === ""){
        errors.password = "Vui lòng nhập mật khẩu"
        errors.status = false;
    }
    // else if(!password_partten.test(values.password)){
    //     errors.password = "Mật khẩu không đúng định dạng";
    // }
    
    return errors;
}