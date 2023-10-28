import axios from "axios";
import jwtDecode from "jwt-decode";
import { IUser } from "@/types";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface IDecodedProps {
  name: string;
  picture: string;
  sub: string;
}

export const createOrGetUser = async (response: any, addUser:any) => {
  const decoded: IDecodedProps = jwtDecode(response.credential);

  console.log(decoded);

  const { name, picture, sub } = decoded;

  const user = {
    _id: sub,
    _type: "user",
    userName: name,
    image: picture,
  };

  addUser(user)

  await axios.post("http://localhost:3000/api/auth", user);
};
