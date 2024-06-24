"use client";
import Box from "@mui/material/Box";
import { Button, Grid, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import React from "react";
import { toast } from "react-toastify";
import { constant } from "../../Utils/constants";
import { hideLoader } from "../../Redux/Slice/loaderSlice";
import { addBookOnRentAPI, paymentAPI } from "../../APIs/bookAPIs";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { PaymentDataInterface } from "@/app/Utils/userInterface";

export default function Payment(props: any) {
  console.log("props", props);

  const stripe: any | null = useStripe();
  const elements: any | null = useElements();
  const navigate = useRouter();

  //Redux
  const dispatch = useDispatch();

  // Function to wait for the CardElement
  const getCardElement = async () => {
    let retries = 1; // Maximum number of retries
    let delay = 1000; // Delay between retries in milliseconds

    for (let i = 0; i < retries; i++) {
      const cardElement = elements.getElement(CardElement);
      console.log("cardElement", cardElement);
      
      if (cardElement) {
        return cardElement;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    return null;
  };

  const handleOnRent = async (data: PaymentDataInterface) => {
    console.log("data", data);

    console.log("CardElement", CardElement);
    const cardElement = await getCardElement();
    console.log("cardElement", cardElement);
    // if (!cardElement) {
    //   console.error("CardElement not found.");
    //   toast.error(
    //     "Payment form is not properly initialized. Please refresh the page and try again."
    //   );
    //   return;
    // }

    paymentAPI(data)
      .then((paymentData: any) => {
        console.log("paymentData", paymentData);
        return new Promise((resolve, reject) => {
          // Stripe payment getway integration
          stripe
            .createPaymentMethod({
              type: "card",
              card: cardElement,
            })
            .then((paymentMethod: any) => {
              console.log("paymentMethod", paymentMethod);
              const data = {
                clientSecret: paymentData.data.client_secret,
                paymentMethodId: paymentMethod.paymentMethod.id,
              };
              resolve(data);
            })
            .catch((err: any) => reject(err));
        });
      })
      .then((res: any) => {
        console.log("res for confirmCardPayment", res);
        return stripe.confirmCardPayment(res.clientSecret, {
          payment_method: res.paymentMethodId,
        });
      })
      .catch((error: any) => {
        console.log("Inside error", error);
        toast.error(error?.response?.data?.message);
      })
      .finally(() => {
        dispatch(hideLoader());
      });
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12} style={{ paddingBottom: 20 }}>
        <Button
          variant="contained"
          style={{
            color: "black",
          }}
          onClick={() => handleOnRent(props.paymentData)}
          type="button"
        >
          {constant.PAY}
        </Button>
      </Grid>
    </Grid>
  );
}
