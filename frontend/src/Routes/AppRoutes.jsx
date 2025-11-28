import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Profile from "../Pages/PRofile";
import Register from "../Pages/Register";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
export default function AppRoutes() {
  return (
    <>
      <Routes>     
           <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to={"/login"} />} />
          <Route path="*" element={<Navigate to={"/login "} />} />
        </Route>
        <Route element={<PrivateRoutes/>}>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Navigate to={"/home"} />} />
          <Route path="*" element={<Navigate to={"/home"} />} />
        </Route>
      </Routes>
    </>
  );
}
