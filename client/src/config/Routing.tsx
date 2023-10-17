import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import { useAuth } from "./PrivateRoute";

function PrivateRoute() {
    const auth = useAuth();
    return auth ? <Outlet /> : <Navigate to="/" />;
}

const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<PrivateRoute />} >
                <Route path="" element={<Dashboard />} />
            </Route>
        </Routes>
    )
}

export default Routing;