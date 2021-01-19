import nc from "next-connect";
import all from "../../middlewares/all";

import { ObjectId } from "mongodb";

const handler = nc();
handler.use(all);

handler.post(async (req, res) => {
  console.log(req.body);
  if (!req.user) {
    res.status(400).json({ errorMsg: "Not logged in" });
    return;
  }

  if (!req.body.title || !req.body.description) {
    res.status(400).json({ errorMsg: "Missing field(s)" });
    return;
  }

  const { title, description } = req.body;

  const jobRes = await req.db.collection("jobs").insertOne({
    owner: req.user.username,
    title,
    description,
    status: "open",
    bids: [],
  });

  if (!jobRes) {
    res.status(500).json({ errorMsg: "Error adding job to database" });
    return;
  }

  const userRes = await req.db
    .collection("users")
    .updateOne(
      { username: req.user.username },
      { $push: { ownedJobs: jobRes.insertedId } }
    );

  if (!userRes) {
    res.status(500).json({ errorMsg: "Error updating user profile" });
    return;
  }
  res.status(201).json({ jobId: jobRes.insertedId });
});

handler.get(async (req, res) => {
  console.log(req.query);
  res.send("hi");
});

export default handler;
