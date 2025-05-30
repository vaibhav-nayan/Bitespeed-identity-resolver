import { Request, Response } from "express";
import { handleIdentify } from "../services/contact.services";
import { IdentifyContactRequest } from "../types";

export const identifyContact = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber } : IdentifyContactRequest = req.body;
    // console.log("From controller.ts, Request Body : ", req.body);
    const result = await handleIdentify(email?.toLowerCase(), phoneNumber);
    res.json({ contact: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};