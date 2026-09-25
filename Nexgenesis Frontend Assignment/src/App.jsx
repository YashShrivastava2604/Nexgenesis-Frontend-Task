import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/products" element={<Products />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/products" replace />}
      />
    </Routes>
  );
};

export default App;