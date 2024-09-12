import {createBrowserRouter} from 'react-router-dom';
import Home from './views/Home/home';
import DefaultLayout from './components/Layouts/DefaultLayout';
import GuestLayout from './components/Layouts/GuestLayout';
import LoginPage from './views/Login/LoginPage';
const router = createBrowserRouter ([
    {
        path:'/',
        element: <DefaultLayout />,
        children:[
            {
                path:'/',
                element: <Home />,
            }
        ]
    },
    {
        path:'/',
        element: <GuestLayout />,
        children:[
            {
                path:'/login',
                element: <LoginPage />,
            }           
        ]
    }
]);
 
export default router;