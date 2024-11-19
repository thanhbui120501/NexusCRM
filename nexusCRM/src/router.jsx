import { createBrowserRouter } from "react-router-dom";
import Statistic from "./views/Statistics/statistics_page";
import DefaultLayout from "./components/Layouts/DefaultLayout";
import GuestLayout from "./components/Layouts/GuestLayout";
import LoginPage from "./views/Login/LoginPage";
import Account from "./views/System_Management/Account/account_page";
import Customer from "./views/System_Management/Customer/customer_page";
import Role from "./views/System_Management/Role/role_page";
import Setting from "./views/Setting/setting_page";
import Program from "./views/Sales_Program/program_page";
import Help from "./views/Help/help_page";
import ProtectedRoute from "./components/protected_route";
import AccountCreate from "./views/System_Management/Account/account_create/account_create";
import AccountDetail from "./views/System_Management/Account/account_detail/account_detail";
import CustomerCreate from "./views/System_Management/Customer/customer_create/customer_create_page";
import CustomerDetail from "./views/System_Management/Customer/customer_detail/customer_detail_page";
import ProductPage from "./views/Sell/Product/product_page";
import WarehousePage from "./views/Sell/Warehouse/warehouse_page";
import OrderPage from "./views/Sell/Order/order_page";
import ProductCreatePage from "./views/Sell/Product/product_create/product_create_page";
import ProductDetailPage from "./views/Sell/Product/product_detail/product_detail_page";
const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Statistic />,
            },
            {
                path: "/account",
                element: (
                    <ProtectedRoute>
                        <Account />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/account/:id",
                element: (
                    <ProtectedRoute>
                        <AccountDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/account/create",
                element: (
                    <ProtectedRoute>
                        <AccountCreate />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/customer",
                element: (
                    <ProtectedRoute>
                        <Customer />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/customer/create",
                element: (
                    <ProtectedRoute>
                        <CustomerCreate />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/customer/:id",
                element: (
                    <ProtectedRoute>
                        <CustomerDetail />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/statistic",
                element: <Statistic />,
            },
            {
                path: "/role",
                element: (
                    <ProtectedRoute>
                        <Role />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/products",
                element: <ProductPage />,
            },
            {
                path: "/products/create",
                element: <ProductCreatePage />,
            },
            {
                path: "/products/:id",
                element: <ProductDetailPage />,
            },
            {
                path: "/warehouses",
                element: <WarehousePage />,
            },
            {
                path: "/orders",
                element: <OrderPage />,
            },
            {
                path: "/setting",
                element: <Setting />,
            },

            {
                path: "/sell-program",
                element: <Program />,
            },
            {
                path: "/help",
                element: <Help />,
            },
        ],
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <LoginPage />,
            },
        ],
    },
]);

export default router;
