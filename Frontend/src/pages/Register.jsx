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
import { registerSchema } from "@/schemas/authSchemas";
import { registerUser } from "@/services/user.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const {
    reset,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: {
        salutation: "",
        firstname: "",
        lastname: "",
      },
      email: "",
      password: "",
      age: "",
      phoneNumber: "",
      profilePhoto: undefined,
    },
  });

  // console.log("errors :: ", errors);
  // console.log("watch :: ", watch());

  const userRegisterMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("User registered successfully...");
      handleResetForm();
      navigate("/user/login");
    },
    onError: (error) => {
      console.error("Error while User registration ::", error);
      console.error(error?.response?.data?.error);
      console.error(error?.response?.data?.message);
      toast.error(
        error.response.data.error ||
          "Something went wrong while user registaration..."
      );
    },
  });

  const onSubmit = (data) => {
    console.log("Data ::", data);
    userRegisterMutation.mutate(data);
  };

  const handleResetForm = () => {
    reset();
  };

  return (
    <>
      <div className="m-4 h-[500px]">
        {/* <Button
          variant="outline"
          color="blue"
          className="cursor-pointer"
          onClick={handleLogin}
        >
          Login
        </Button> */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="min-w-[500px] w-[500px] mx-auto my-[50px] p-4 border rounded-lg flex flex-col"
        >
          <div className="grid grid-cols-5 gap-2">
            {/* salutation */}
            <Controller
              name="name.salutation"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-2 mt-4 col-span-1">
                  <Label className="">Salutation</Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    required
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr.">Mr.</SelectItem>
                      <SelectItem value="Ms.">Ms.</SelectItem>
                      <SelectItem value="Mrs.">Mrs.</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors?.name?.salutation?.message && (
                    <span className="text-sm text-red-600">
                      {errors.name.salutation.message}
                    </span>
                  )}
                </div>
              )}
            />

            {/* firstname */}
            <div className="flex flex-col gap-2 mt-4 col-span-2">
              <Label className="">
                Firstname <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("name.firstname", {
                  required: "Firstname is required",
                })}
                placeholder="Firstname"
                required
                className=""
              />
              {errors?.name?.firstname?.message && (
                <span className="text-sm text-red-600">
                  {errors.name.firstname.message}
                </span>
              )}
            </div>

            {/* lastname */}
            <div className="flex flex-col gap-2 mt-4 col-span-2">
              <Label className="">
                Lastname <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("name.lastname", {
                  required: "Lastname is required",
                })}
                placeholder="Lastname"
                className=""
              />
              {errors?.name?.lastname?.message && (
                <span className="text-sm text-red-600">
                  {errors.name.lastname.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
            {/* age */}
            <div className="flex flex-col gap-2 mt-4">
              <Label className="">Age</Label>
              <Input
                type="number"
                {...register("age")}
                placeholder="Age"
                className=""
              />
              {errors?.age?.message && (
                <span className="text-sm text-red-600">
                  {errors.age.message}
                </span>
              )}
            </div>

            {/* phoneNumber */}
            <div className="flex flex-col gap-2 mt-4">
              <Label className="">Phone no.</Label>
              <Input
                type="tel"
                {...register("phoneNumber")}
                placeholder="Phone number"
                className=""
              />
              {errors?.phoneNumber?.message && (
                <span className="text-sm text-red-600">
                  {errors.phoneNumber.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* profilePhoto */}
            <div className="flex flex-col gap-2 mt-4">
              <Label className="">Profile Picture</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files;
                  setValue("profilePhoto", files?.[0] ?? undefined, {
                    shouldValidate: true,
                  });
                }}
                className=""
              />
              {errors?.profilePhoto?.message && (
                <span className="text-sm text-red-600">
                  {errors.profilePhoto.message}
                </span>
              )}
            </div>
            {watch("profilePhoto") && (
              <img
                src={URL.createObjectURL(watch("profilePhoto"))}
                alt="Preview"
                className="mt-4 w-24 h-24 object-cover rounded-lg border"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 w-full mt-8">
            <Button
              type="button"
              onClick={handleResetForm}
              className="cursor-pointer"
            >
              Reset
            </Button>
            <Button type="submit" className="cursor-pointer">
              Register
            </Button>
          </div>

          <div className="mt-6 w-full flex text-sm justify-center items-center">
            Already have an account?{" "}
            <span className="text-black font-semibold ml-2">
              <Link to="/user/login">Login</Link>
            </span>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
