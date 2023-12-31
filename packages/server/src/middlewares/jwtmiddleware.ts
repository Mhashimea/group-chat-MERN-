import { NextFunction } from "express";
import jwt from "jsonwebtoken";

export default async (req: any, res: any, next: NextFunction) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  const JWTSECERET = process.env.JWT_SECRET || "";
  if (token) {
    jwt.verify(token, JWTSECERET, (err: any, decoded: any) => {
      if (err) {
        res.setHeader("Content-Type", "text/plain");
        res.status(401).send("Unauthorized");
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else res.status(403).send("No token provided");
};
