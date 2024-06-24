"use client";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, CircularProgress, Grid, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { listOfRentalBooks } from "../../Redux/Slice/bookSlice";
import { constant } from "../../Utils/constants";
import { hideLoader, showLoader } from "../../Redux/Slice/loaderSlice";
import { cartListAPI } from "../../APIs/bookAPIs";
import Payment from "../../Components/Payment/payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export default function Cart() {
  const stripePromise = loadStripe(
    "pk_test_51PTKQoRoeFgBnZ4aSt1BeCgngGEZaVwCOehWa85CopqPClpHELASul82JAwAKzb6NDUEdWYTUpKpIWoegVAh3lGC00IVAUOpc3"
  );
  const navigate = useRouter();
  //Redux
  const dispatch = useDispatch();
  const { loader } = useSelector((state: any) => state?.loader);
  const { rentalData } = useSelector((state: any) => state?.book);

  const fetchRentalBookDataFromApi = () => {
    cartListAPI()
      .then((cartListData: any) => {
        if (cartListData?.data?.statusCode === 200) {
          dispatch(listOfRentalBooks(cartListData?.data?.data));
        }
      })
      .catch((error: any) => {
        toast.error(error?.response?.data?.message);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  useEffect(() => {
    dispatch(showLoader());
    fetchRentalBookDataFromApi();
  }, []);

  let columns: GridColDef[] = [
    {
      field: "book_title",
      headerName: constant.BOOK_TITLE,
      width: 100,
    },
    {
      field: "book_author",
      headerName: constant.BOOK_AUTHOR,
      width: 100,
    },
    {
      field: "publisher_name",
      headerName: constant.PUBLISHER_NAME,
      width: 100,
    },
    {
      field: "publish_year",
      headerName: constant.PUBLISHER_YEAR,
      width: 80,
    },
    {
      field: "rent",
      headerName: constant.RENT,
      width: 80,
    },
  ];

  const paymentData = {
    amount: 0,
    currency: "usd",
  };

  rentalData.map((data: any) => {
    paymentData.amount = paymentData.amount + +data.rent;
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
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
          <Grid item xs={12}>
            <h1 style={{ padding: 20, textAlign: "center", fontSize: 25 }}>
              {constant.CART}
            </h1>
          </Grid>
          <Grid item xs={12}>
            {loader ? (
              <Box
                sx={{ height: 400, width: "100%" }}
                style={{ textAlign: "center" }}
              >
                <CircularProgress size={25} />
              </Box>
            ) : (
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid rows={rentalData} columns={columns} />
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <h1 style={{ padding: 20, textAlign: "center", fontSize: 25 }}>
              {loader ? (
                <CircularProgress size={25} />
              ) : (
                // <Elements stripe={stripePromise}>
                //   <Payment paymentData={paymentData} />
                // </Elements>
                <Grid container justifyContent="center" alignItems="center">
                  <Grid item xs={12} style={{ paddingBottom: 20 }}>
                    <Button
                      variant="contained"
                      style={{
                        color: "black",
                      }}
                      // onClick={() => handleOnRent(props.paymentData)}
                      type="button"
                    >
                      {constant.PAY}
                    </Button>
                  </Grid>
                </Grid>
              )}
            </h1>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
