import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import User from "./pages/Users"
import Login from "./pages/Login";
import { isAuthenticated } from "./utils/authGuard";
import Deposits from "./pages/components/deposits/Deposits";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={ <Layout />
          // isAuthenticated() ? <Layout /> : <Navigate to="/login" replace />
        }
      >
        <Route index element={<User />} />
        <Route path="/deposits" element={<Deposits />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
