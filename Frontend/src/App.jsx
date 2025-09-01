import {
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import { useSelector } from "react-redux";

function App() {
  const auth = useSelector((state) => state.auth);
  return (
    <>
      <Router>
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
          {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}

          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <ToastContainer limit={3} />
      {console.log(auth)}
    </>
  );
}

export default App;
