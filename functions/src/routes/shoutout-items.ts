import express from "express";
import { ObjectId } from "mongodb";
import { getClient } from "../db";
import Shoutout from "../models/Shoutout";

const routes = express.Router();

routes.get("/shoutouts", async (req, res) => {
  const shoutoutTo: string = req.query.shoutoutTo as string;
  const shoutoutFrom: string = req.query.shoutoutFrom as string;
  const pageSize: number = parseInt(req.query.pageSize as string);

  let query: any = {};

  if (shoutoutTo) {
    query = { to: shoutoutTo };
  }
  if (shoutoutFrom) {
    query = { from: shoutoutFrom };
  }

  try {
    const client = await getClient();
    if (!isNaN(pageSize)) {
      const results = await client
        .db()
        .collection<Shoutout>("shoutouts")
        .find(query)
        .limit(pageSize)
        .toArray();
      res.json(results);
    } else {
      const results = await client
        .db()
        .collection<Shoutout>("shoutouts")
        .find(query)
        .toArray();
      res.json(results);
    }
  } catch (err) {
    console.error("ERROR", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

routes.get("/shoutouts/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const client = await getClient();
    const result = await client
      .db()
      .collection<Shoutout>("shoutouts")
      .findOne({ _id: new ObjectId(id) });
    if (result) {
      res.json(result);
    } else {
      res.status(404).send({ message: "Not Found" });
    }
  } catch (err) {
    console.error("ERROR", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

routes.post("/shoutouts", async (req, res) => {
  const newShoutout: Shoutout = req.body;
  try {
    const client = await getClient();
    const result = await client
      .db()
      .collection<Shoutout>("shoutouts")
      .insertOne(newShoutout);
    newShoutout._id = result.insertedId;
    res.status(201);
    res.json(newShoutout);
  } catch (err) {
    console.error("ERROR", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default routes;
