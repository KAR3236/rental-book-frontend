"use client";
import Box from "@mui/material/Box";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { listOfBooks } from "../../Redux/Slice/bookSlice";
import { constant } from "../../Utils/constants";
import { hideLoader, showLoader } from "../../Redux/Slice/loaderSlice";
import { addBookOnRentAPI, listOfBookAPI } from "../../APIs/bookAPIs";

export default function ListOfBooks() {
  const navigate = useRouter();
  //Redux
  const dispatch = useDispatch();
  const { loader } = useSelector((state: any) => state?.loader);
  const { bookData } = useSelector((state: any) => state?.book);

  const fetchRentalBookDataFromApi = () => {
    listOfBookAPI()
      .then((listOfBookData: any) => {
        if (listOfBookData?.data?.statusCode === 200) {
          dispatch(listOfBooks(listOfBookData?.data?.data));
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
    // fetchDataFromApi();
    dispatch(showLoader());
    fetchRentalBookDataFromApi();
  }, []);

  const handleOnRent = (id: number) => {
    addBookOnRentAPI(id)
      .then((addBookOnRentData: any) => {
        if (addBookOnRentData?.data?.statusCode === 201) {
          toast.success(addBookOnRentData?.data?.message);
        } else {
          toast.error(addBookOnRentData?.data?.message);
        }
      })
      .catch((error: any) => {
        toast.error(error?.response?.data?.message);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  return (
    <Box
      sx={{
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
            Books
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
          bookData.map((data: any, key: any) => {
            return (
              <Grid
                item
                xs={3}
                key={key}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={`http://localhost:2000/${data.book_image}`}
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
                  <CardActions>
                    <Button size="small" onClick={() => handleOnRent(data.id)}>
                      Add to {constant.CART}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>
    </Box>
  );
}
