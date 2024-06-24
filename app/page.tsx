"use client";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { Form } from "./Components/Form";
import { loginValidation } from "./Validations/userValidation";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { hideLoader, showLoader } from "./Redux/Slice/loaderSlice";
import { loginAPI } from "./APIs/bookAPIs";
import { constant } from "./Utils/constants";

export default function Home() {
  const navigate = useRouter();

  //Redux
  const dispatch = useDispatch();
  const { loader } = useSelector((state: any) => state?.loader);

  // Formik for validation and handle event by user
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidation,
    onSubmit: (values) => {
      dispatch(showLoader());
      loginAPI(values)
        .then((loginData: any) => {
          if (loginData?.data?.statusCode === 200) {
            Cookies.set("loginToken", loginData?.data?.data?.token, {
              expires: 1,
              path: "/",
            });
            toast.success(loginData?.data?.message);
            navigate.push("/dashboard");
          } else {
            toast.error(loginData?.data?.message);
          }
        })
        .catch((error: any) => {
          if (error.response?.data?.statusCode === 400) {
            toast.error(error?.response?.data?.message[0]);
          } else {
            toast.error(error?.response?.data?.message);
          }
        })
        .finally(() => {
          dispatch(hideLoader());
        });
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <Paper
        sx={{
          p: 2,
          margin: "auto",
          maxWidth: 500,
          flexGrow: 1,
        }}
      >
        <Grid container justifyContent="center" alignItems="center">
          <Form onSubmit={formik.handleSubmit}>
            <Grid item xs={12}>
              <h4 style={{ padding: 20, textAlign: "center", fontSize: 25 }}>
                {constant.LOGIN}
              </h4>
            </Grid>

            <Grid item xs={12}>
              <TextField
                id={constant.EMAIL}
                label={constant.EMAIL}
                name={constant.EMAIL.toLowerCase()}
                type={constant.EMAIL.toLowerCase()}
                placeholder="name@example.com"
                style={{ padding: 10 }}
                value={formik?.values?.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              {formik?.touched?.email && formik?.errors?.email ? (
                <div
                  style={{ color: "red", paddingLeft: 10, paddingBottom: 10 }}
                >
                  {formik?.errors?.email}
                </div>
              ) : null}
            </Grid>

            <Grid item xs={12}>
              <TextField
                id={constant.PASSWORD}
                label={constant.PASSWORD}
                name={constant.PASSWORD.toLowerCase()}
                type={constant.PASSWORD.toLowerCase()}
                placeholder="Enter password"
                style={{ padding: 10, paddingBottom: "0" }}
                value={formik?.values?.password}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
              {formik?.touched?.password && formik?.errors?.password ? (
                <div
                  style={{ color: "red", paddingLeft: 10, paddingBottom: 10 }}
                >
                  {formik?.errors?.password}
                </div>
              ) : null}
            </Grid>

            <Grid item xs={12} style={{ textAlign: "center", padding: 18 }}>
              <Button
                type="submit"
                variant="contained"
                style={{ color: "black", backgroundColor: "white" }}
              >
                {loader ? <CircularProgress size={25} /> : constant.LOGIN}
              </Button>
            </Grid>
          </Form>
        </Grid>
      </Paper>
    </Box>
  );
}
