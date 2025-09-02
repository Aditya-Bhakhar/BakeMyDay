import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useRef, useState } from "react";
import { logout } from "@/redux/slice/authSlice";
import { toast } from "react-toastify";
import { logoutUser } from "@/services/user.service";
import { useMutation } from "@tanstack/react-query";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const menuRef = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoutUserMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      dispatch(
        logout({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        })
      );
      toast.success("User logged out successfully...");
      navigate("/user/login");
    },
    onError: (error) => {
      console.error("Error while logout user :: ", error);
      console.error(error?.response?.data?.error);
      console.error(error?.response?.data?.message);
      toast.error(
        error.response.data.error || "Something went wrong while logout user..."
      );
    },
  });

  const handleLogout = () => {
    logoutUserMutation.mutate();
  };

  return (
    <header className="w-full shadow-sm sticky top-0 bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-red-600 transtion-">
          🍰 BakeMyDay
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/" className="hover:text-red-600 transition-colors">
            Home
          </Link>
          <Link to="/product" className="hover:text-red-600 transition-colors">
            Products
          </Link>
          <Link to="/cart" className="hover:text-red-600 transition-colors">
            Cart
          </Link>
          <Link to="/order" className="hover:text-red-600 transition-colors">
            Orders
          </Link>

          {user ? (
            <>
              <span className="text-sm text-gray-600">
                Hi, {user.name.firstname}
              </span>
              <Button
                className="cursor-pointer"
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              className="cursor-pointer"
              size="sm"
              onClick={() => navigate("/user/login")}
            >
              Login
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          ref={menuRef}
          className="md:hidden bg-white border-red-600 hover:bg-gray-100/60 border hover:border-red-600 cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="text-red-600" size={26} />
        </Button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-sm px-4 py-3 space-y-3 sm:flex sm:justify-between sm:items-center">
          <Link
            to="/"
            className="block hover:text-red-600 text-center my-auto sm:mt-3 mb-2"
          >
            Home
          </Link>
          <Link
            to="/product"
            className="block hover:text-red-600 text-center my-auto sm:mt-3 mb-2"
          >
            Products
          </Link>
          <Link
            to="/cart"
            className="block hover:text-red-600 text-center my-auto sm:mt-3 mb-2"
          >
            Cart
          </Link>
          <Link
            to="/order"
            className="block hover:text-red-600 text-center my-auto sm:mt-3 mb-2"
          >
            Orders
          </Link>

          {user ? (
            <div className="flex justify-center items-center gap-2">
              <p className="text-gray-600">Hi, {user.name.firstname}</p>
              <Button
                className="cursor-pointer"
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              className="cursor-pointer"
              size="sm"
              onClick={() => navigate("/user/login")}
            >
              Login
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
