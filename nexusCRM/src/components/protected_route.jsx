/* eslint-disable react/prop-types */
import { Navigate } from 'react-router-dom';


const ProtectedRoute = ({ children }) => {
  
const localUser = JSON.parse(localStorage.getItem("USER"));
  if (localUser.role[0].role_name !== 'Quản lí') {
    return <Navigate to="/" />; // Chuyển hướng về trang chính
  }

  return children;
};
export default ProtectedRoute;