import { User } from "../../db/entities";

export type UserResponseData = {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  isAdmin: boolean;
  product: string;
  createdAt: Date;
  updatedAt: Date;
};
