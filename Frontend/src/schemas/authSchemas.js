import z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const registerSchema = z.object({
  name: z.object({
    salutation: z.enum(["Mr.", "Ms.", "Mrs.", ""]).optional(),
    firstname: z
      .string()
      .min(2, { message: "Firstname must be at least 2 characters long..." }),
    lastname: z
      .string()
      .min(2, { message: "Lastname must be at least 2 characters long..." }),
  }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long..." }),
  age: z.coerce
    .number()
    .int("Age must be an integer")
    .min(0, { message: "Age must be positive" })
    .max(120, { message: "Age must be realistic" })
    .optional(),
  phoneNumber: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[0-9]{10,15}$/.test(val), {
      message: "Phone number must be 10–15 digits and contain only numbers",
    }),
  profilePhoto: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file) return true;

        if (!(file instanceof File)) return false;

        return file.type.startsWith("image/");
      },
      { message: "Only image files are allowed" }
    )
    .refine(
      (file) => {
        if (!file) return true;
        return file.size <= 10 * 1024 * 1024;
      },
      { message: "File size must be less than 10MB" }
    ),
});
