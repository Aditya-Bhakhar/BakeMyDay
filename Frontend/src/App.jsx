import {
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import Home from "./components/home/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import { useSelector } from "react-redux";
import ProductsList from "./pages/ProductsList";
import OrderList from "./pages/OrderList";
import Cart from "./pages/Cart";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function App() {
  const auth = useSelector((state) => state.auth);
  return (
    <>
      <Router>
        <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/user/register" element={<Register />} />
          <Route path="/user/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            exact
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product"
            element={
              <ProtectedRoute>
                <ProductsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <OrderList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </Router>
      <ToastContainer limit={3} />
      {console.log(auth)}
    </>
  );
}

export default App;
