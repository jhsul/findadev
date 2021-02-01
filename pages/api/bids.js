import nc from "next-connect";
import all from "../../middlewares/all";

import { ObjectId } from "mongodb";

const handler = nc();
handler.use(all);

handler.post(async (req, res) => {
  if (!req.user) {
    res.status(400).json({ errorMsg: "Not logged in" });
    return;
  }

  if (!req.body.jobId || !req.body.how || !req.body.why || !req.body.price) {
    res.status(400).json({ errorMsg: "Missing field(s)" });
    return;
  }

  const _id = ObjectId(req.body.jobId);
  if (!_id) {
    res.status(400).json({ errorMsg: "Not a valid job ID" });
    return;
  }

  const jobRes = await req.db.collection("jobs").findOne({ _id });

  if (!jobRes) {
    res.status(400).json({ errorMsg: "This isn't a job!" });
    return;
  }

  if (jobRes.status !== "open") {
    res.status(400).json({ errorMsg: "This job is not currently open" });
    return;
  }

  const bidSearchRes = await req.db
    .collection("bids")
    .find({ jobId: _id, bidder: req.user.username })
    .toArray();
  if (bidSearchRes.length > 0) {
    res.status(400).json({ errorMsg: "You already bidded on this job!" });
    return;
  }

  // ACTUALLY MAKE THE BID

  const bidRes = await req.db.collection("bids").insertOne({
    jobId: _id,
    bidder: req.user.username,
    how: req.body.how,
    why: req.body.why,
    price: req.body.price,
    status: "waiting",
  });

  const bidId = bidRes.ops[0]._id;

  const userRes = await req.db
    .collection("users")
    .updateOne({ username: req.user.username }, { $push: { bids: bidId } });

  const jobUpdateRes = await req.db
    .collection("jobs")
    .updateOne({ _id }, { $push: { bids: bidId } });

  res.status(204).end();
});

export default handler;
