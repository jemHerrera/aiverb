import express from "express";
import { DI } from "..";
import { User } from "../db/entities";
import { AuthenticatedRequest } from "../middlewares/userAuthenticate";

export type UserGetOwnRequest = {};
export type UserGetOwnResponse = Omit<User, "password">;

export const userGetOwn = async (
  req: AuthenticatedRequest,
  res: express.Response<UserGetOwnResponse>
) => {
  try {
    const { em } = DI;

    if (!req.user) return res.sendStatus(500);

    const { id } = req.user;

    const user = await em.findOne(User, { id });
    if (!user) return res.sendStatus(500);

    // Remove password from the response
    const { password: p, ...successResponse } = user;

    return res.status(200).json(successResponse).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export type UserGetRequest = { id: string };
export type UserGetResponse = Omit<User, "password">;

export const userGet = async (
  req: AuthenticatedRequest<{}, {}, UserGetRequest>,
  res: express.Response<UserGetResponse>
) => {
  try {
    const { em } = DI;

    if (!req.user) return res.sendStatus(500);
    if (!req.user.isAdmin) return res.sendStatus(403);

    const { id } = req.body;

    const user = await em.findOne(User, { id });
    if (!user) return res.sendStatus(404);

    // Remove password from the response
    const { password: p, ...successResponse } = user;

    return res.status(200).json(successResponse).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
