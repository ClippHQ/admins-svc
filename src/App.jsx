import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { isAuthenticated } from "./utils/authGuard";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated() ? <Layout /> : <Navigate to="/login" replace />
        }
      >
        <Route index element={<Home />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
