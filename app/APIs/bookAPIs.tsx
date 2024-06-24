import {
  LoginDataInterface,
  PaymentDataInterface,
} from "../Utils/userInterface";
import {
  ADD_BOOK_ON_RENT_API,
  CART_LIST_API,
  LIST_OF_BOOKS,
  LOGIN_API,
  PAYMENT_API,
  VIEW_BOOK_ON_RENT_API,
} from "./APIs";
import { baseURL } from "./baseUrl";
import Cookies from "js-cookie";

const loginToken = Cookies.get("loginToken");

export async function loginAPI(data: LoginDataInterface) {
  return await baseURL.post(LOGIN_API, data);
}

export async function listOfRentalBookAPI() {
  return await baseURL.get(VIEW_BOOK_ON_RENT_API, {
    headers: {
      Authorization: `Bearer ${loginToken}`,
    },
  });
}

export async function listOfBookAPI() {
  return await baseURL.get(LIST_OF_BOOKS, {
    headers: {
      Authorization: `Bearer ${loginToken}`,
    },
  });
}

export async function addBookOnRentAPI(book_id: number) {
  return await baseURL.get(`${ADD_BOOK_ON_RENT_API}/${book_id}`, {
    headers: {
      Authorization: `Bearer ${loginToken}`,
    },
  });
}

export async function cartListAPI() {
  return await baseURL.get(CART_LIST_API, {
    headers: {
      Authorization: `Bearer ${loginToken}`,
    },
  });
}

export async function paymentAPI(data: PaymentDataInterface) {
  return await baseURL.post(PAYMENT_API, data, {
    headers: {
      Authorization: `Bearer ${loginToken}`,
    },
  });
}
