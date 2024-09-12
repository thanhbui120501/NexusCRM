import React, { useRef } from 'react';
import axiosClient from '../../axiosClient';
import { useStateContext } from '../../contexts/contextprovider';
import Validation from '../../validation';
import Example from '../../components/dialog';
//import { useState } from 'react'
// import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
// import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

function LoginForm() {
  
  //Handle show and hide password
  const [values, setValues] = React.useState({
    password: "",
    username:"thanhbui120501",
    showPassword: false,
    rememberPassword:false,
  });
  
  const [errors, setError] = React.useState({});

  const handleClickShowPassword = () => {
      setValues({
          ...values,
          showPassword: !values.showPassword,
      });
  };

  const handleClickRememberPassword = () => {
    setValues({
        ...values,
        rememberPassword: !values.rememberPassword,
    });
  }
  const handleMouseDownPassword = (event) => {
      event.preventDefault();
  };

  const handlePasswordChange = (prop) => (event) => {
      setValues({
          ...values,
          [prop]: event.target.value,
      });            
  };

  const handleUsernameChange = (prop) => (event) => {
    setValues({
        ...values,
        [prop]: event.target.value,
    });
  };

  // eslint-disable-next-line no-unused-vars
  function handleInput(event){
    const newObj = {
      ...values,
      [event.target.name]: event.target.value
    }
    setValues(newObj);
  }

  //Hover
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true); 
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
   
  
  //Login
  const usernameRef = useRef();
  const passwordRef = useRef();
  // eslint-disable-next-line no-unused-vars
  const rememberpasswordRef = useRef();
  //set user and token  
  const {setUser, setToken} = useStateContext();
  //show dialog
  const [open, setOpen] = React.useState(false);
  //set value show dialog
  const [dialog, setValuesDialog] = React.useState({
    title:"",
    description:"",
    color: "",
    bgColor:"",
    hoverColor:""
  });
  
  const handleClickToOpen = () => {
    setOpen(true);
  };

  const handleToClose = () => {
      setOpen(false);
  };
  //on login
  const Submit = (ev) => {
    ev.preventDefault(); 
    setError(Validation(values));
    
    const payload = JSON.stringify({
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      remember_token: values.rememberPassword ? 'true':'false',          
    });
    

    axiosClient.post("/account/login", payload).then(({data}) => {                 
      if(data.status_code == 401){
        setValuesDialog({
          ...dialog,
          title:'Đăng nhập thất bại',
          description:'Tài khoản hoặc mật khẩu không chính xác, vui lòng kiểm tra lại thông tin đăng nhập. Xin cảm ơn ❤️',
          color:'text-red-600',
          bgColor:'bg-red-600',
          hoverColor:'hover:bg-red-500',
        });
        handleClickToOpen();
      }else{
        if(data.status_code == 403){
          setValuesDialog({
            ...dialog,
            title:'Đăng nhập thất bại',
            description:'Tài khoản của bạn đã bị vô hiệu hóa nên bạn không thể đăng nhập vào hệ thống, vui lòng liên hệ với quản trị liên để có thêm thông tin chi tiết. Xin cảm ơn ❤️',
            color:'text-orange-600',
            bgColor:'bg-orange-600',
            hoverColor:'hover:bg-orange-500',
          });
          handleClickToOpen();
        }else{               
          setUser(data.data);
          setToken(data.Bearer_token); 
        }
      }     
    }).catch(err => {
      const response = err.response;
      if(response && err.status === 422){       
        console.log(response.data.errors);       
      }     
    });  
  }
  return (
    <form name="frm-login" className="flex flex-col self-center px-6 mt-12 max-w-full font-sans w-[416px] max-md:px-5 max-md:mt-10" onSubmit={Submit}>
      <h2 className="text-3xl font-semibold leading-none text-neutral-900">Đăng nhập</h2>
      <div className="flex flex-col mt-8 w-full">
        <div className="flex flex-col w-full">
          <div className="flex flex-col w-full text-neutral-900">
            <div className="flex flex-col w-full">
              <label htmlFor="username" className="flex items-center self-start text-sm font-medium leading-none">
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="username"
                className="flex gap-2 items-center px-3 py-2 mt-1.5 w-full text-base whitespace-nowrap rounded-lg border border-solid border-neutral-200"              
                onChange={handleUsernameChange("username")}
                placeholder="Nhập tên đăng nhập"
                ref={usernameRef}
              />
              {errors.username && <p className='text-red-600 pt-1'>{errors.username}</p>}
            </div>
          </div>
          <div className="flex flex-col mt-6 w-full">
            <div className="flex flex-col w-full">
              <label htmlFor="password" className="flex items-center self-start text-sm font-medium leading-none text-neutral-900">
                Mật khẩu
              </label>
              <div className="flex gap-2 items-center px-3 py-2 mt-1.5 w-full rounded-lg border border-solid border-neutral-200">
                <input                 
                  type={values.showPassword ? "text" : "password"}           
                  onChange={handlePasswordChange("password")}
                  value={values.password}                  
                  className="flex-1 shrink gap-0.5 self-stretch my-auto min-w-[240px] border-neutral-200"
                  placeholder="Nhập mật khẩu"
                  ref={passwordRef}
                />               
                <img alt='eye-image' onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}  src={values.showPassword ? "../src/assets/showpassword.png" : "../src/assets/hidepassword.png"} className="w-5 h-5" ></img>              
              </div>
              {errors.password && <p className='text-red-600 pt-1'>{errors.password}</p>}
            </div>
          </div>
          <div className="flex gap-2 items-center self-start mt-6">
            <input type="checkbox" checked={values.rememberPassword} onChange={handleClickRememberPassword} id="remember" className="w-4 h-4 bg-blue-500 checked:bg-blue-700 focus:ring-blue-500 focus:ring-2 rounded" />
            <label htmlFor="remember" className="self-stretch my-auto text-sm font-medium leading-none text-neutral-900" >
              Ghi nhớ tài khoản
            </label>
          </div>
        </div>
        <button 
          type="submit" 
          //disabled={values.username!="" && values.password!="" ? true : false } //
          className="flex overflow-hidden flex-col mt-8 w-full text-base font-semibold text-center text-white rounded-lg" 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>          
          <span className={`flex-1 shrink gap-2 self-stretch px-4 py-3 w-full ${isHovered ? 'bg-neutral-800': 'bg-neutral-900'}`}>
            Đăng nhập
          </span>
        </button>
        {/* <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                    Deactivate account
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to deactivate your account? All of your data will be permanently removed.
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                Deactivate
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
        </Dialog> */}
        <Example 
          open={open} 
          setOpen={setOpen} 
          onClickToOpen={handleClickToOpen} 
          onClickToClose={handleToClose}
          title={dialog.title}
          description={dialog.description}
          color={dialog.color}
          bgColor={dialog.bgColor}
          hoverColor={dialog.hoverColor}
        />
      </div>
    </form>
  );
}

export default LoginForm;