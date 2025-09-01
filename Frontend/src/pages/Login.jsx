import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loginSuccess } from "@/redux/slice/authSlice";
import { loginSchema } from "@/schemas/authSchemas";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "@/services/user.service";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    reset,
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // console.log("watch :: ", watch());
  // console.log("errors :: ", errors);

  const loginUserMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      dispatch(
        loginSuccess({
          isAuthenticated: true,
          user: data?.user,
          token: data?.accessToken,
        })
      );
      // queryClient.invalidateQueries({ queryKey: ["user-login"] });
      toast.success("User logged in successfully...");
      handleResetForm();

      navigate("/");
    },
    onError: (error) => {
      console.error("Error while User login ::", error);
      console.error("ERROR :: ", error?.response?.data?.error);
      console.error("ERROR :: ", error?.response?.data?.message);
      toast.error(
        error.response.data.error || "Something went wront while user login..."
      );
    },
  });

  const onSubmit = (data) => {
    console.log("Data ::", data);
    loginUserMutation.mutate(data);
  };

  const handleResetForm = () => {
    reset();
  };

  return (
    <>
      <div className="m-4 h-[500px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[400px] mx-auto my-[50px] p-4 border rounded-lg"
        >
          <div className="w-full">
            {/* email */}
            <div className="flex flex-col gap-2 mt-4">
              <Label className="">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="Email"
                required
                className=""
              />
              {errors?.email?.message && (
                <span className="text-sm text-red-600">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* password */}
            <div className="flex flex-col gap-2 mt-4">
              <Label className="">
                Password <span className="text-red-500">*</span>
              </Label>
              <Input
                type="password"
                {...register("password", { required: "Password is required" })}
                placeholder="Password"
                required
                className=""
              />
              {errors?.password?.message && (
                <span className="text-sm text-red-600">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full my-2">
            <Button
              type="button"
              onClick={handleResetForm}
              className="mt-4 cursor-pointer"
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={loginUserMutation.isPending}
              className="mt-4 cursor-pointer"
            >
              {loginUserMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </div>

          <div className="mt-6 w-full flex text-sm flex-col justify-center items-center">
            Don't have an account?{" "}
            <span className="text-black font-semibold">
              <Link to="/user/register">Create new account</Link>
            </span>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
