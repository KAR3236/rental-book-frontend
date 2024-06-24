import * as Yup from "yup";

export const loginValidation = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string()
    .min(8)
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password must contain at least 8 characters, one lowercase letter, one uppercase letter, one number, and one special character"
    )
    .required(),
});
