import { Button } from "@/components/ui/button";
import { logout } from "@/redux/slice/authSlice";
import { logoutUser } from "@/services/user.service";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutUserMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      dispatch(logout({ isAuthenticated: false, user: null, token: null }));
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
    <>
      <div>Home</div>
      <Button onClick={handleLogout} disabled={logoutUserMutation.isPending}>
        {logoutUserMutation.isPending ? "Logging out..." : "Logout"}
      </Button>
    </>
  );
};

export default Home;
