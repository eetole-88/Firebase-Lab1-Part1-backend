import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import exampleroutes from "./routes/shoutout-items";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", exampleroutes);

export const api = functions.https.onRequest(app);
