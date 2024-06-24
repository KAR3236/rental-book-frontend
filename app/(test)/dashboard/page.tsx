"use client";
import Box from "@mui/material/Box";
import {
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { listOfRentalBooks } from "../../Redux/Slice/bookSlice";
import { hideLoader, showLoader } from "../../Redux/Slice/loaderSlice";
import { listOfRentalBookAPI } from "../../APIs/bookAPIs";

export default function Dashboard() {
  //Redux
  const dispatch = useDispatch();
  const { loader } = useSelector((state: any) => state?.loader);
  const { rentalData } = useSelector((state: any) => state?.book);

  const fetchRentalBookDataFromApi = () => {
    listOfRentalBookAPI()
      .then((listOfRentalBookData: any) => {
        if (listOfRentalBookData?.data?.statusCode === 200) {
          dispatch(listOfRentalBooks(listOfRentalBookData?.data?.data));
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

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: "100px",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <h1
            style={{
              padding: 20,
              fontSize: 25,
              color: "black",
            }}
          >
            Rental Books
          </h1>
        </Grid>

        {loader ? (
          <Box
            sx={{ height: 700, width: "100%" }}
            style={{ textAlign: "center" }}
          >
            <CircularProgress size={25} />
          </Box>
        ) : (
          rentalData.map((data: any, key: any) => {
            return (
              <Grid
                item
                xs={3}
                key={key}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card sx={{ maxWidth: 400 }}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {data.book_title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {data.book_author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {data.publisher_name} {data.publish_year}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {data.rent}
                    </Typography>
                  </CardContent>
                  {/* <CardActions>
                      <Button size="small">Share</Button>
                      <Button size="small">Learn More</Button>
                    </CardActions> */}
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>
    </Box>
  );
}
