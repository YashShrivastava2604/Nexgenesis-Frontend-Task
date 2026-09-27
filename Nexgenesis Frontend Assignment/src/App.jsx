import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/products" element={<Products />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/products" element={<Products />} />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />
      </Route>
      <Route
        path="*"
        element={<Navigate to="/products" replace />}
      />
      <Route element={<ProtectedRoute />}>
        <Route path="/products" element={<Products />} />

        <Route
          path="/products/new"
          element={<AddProduct />}
        />

        <Route
          path="/products/:id/edit"
          element={<EditProduct />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />
      </Route>
    </Routes>
  );
};

export default App;