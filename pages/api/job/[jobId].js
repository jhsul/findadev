import nc from "next-connect";
import { ObjectId } from "mongodb";

import all from "../../../middlewares/all";

const handler = nc();
handler.use(all);

handler.delete(async (req, res) => {
  if (!req.user) {
    res.redirect("/login");
    return;
  }

  const {
    query: { jobId },
  } = req;

  const _id = ObjectId(jobId);
  if (!_id) {
    res.status(400).json({ errorMsg: "Invalid ID" });
    return;
  }

  const jobRes = await req.db.collection("jobs").findOne({ _id });
  if (!jobRes) {
    res.status(404).end();
    return;
  }

  if (jobRes.owner !== req.user.username) {
    res.status(403).json({ errorMsg: "You are not the owner of this job" });
    return;
  }

  // Go through and delete all the bids
  // Also take the bids off of bidders' accounts

  jobRes.bids.map(async (bidId) => {
    const bidRes = await req.db.collection("bids").findOne({ _id: bidId });
    const userPullRes = await req.db
      .collection("users")
      .updateOne({ username: bidRes.bidder }, { $pull: { bids: bidId } });

    const bidDelRes = await req.db.collection("bids").deleteOne({ _id: bidId });
  });

  const delRes = await req.db.collection("jobs").deleteOne({ _id });
  const userRes = await req.db
    .collection("users")
    .updateOne({ username: req.user.username }, { $pull: { ownedJobs: _id } });
  res.status(204).end();
});

handler.get(async (req, res) => {
  const {
    query: { jobId },
  } = req;

  const _id = ObjectId(jobId);
  if (!_id) {
    res.status(400).json({ errorMsg: "Invalid ID" });
    return;
  }

  const jobRes = await req.db.collection("jobs").findOne({ _id });
  if (!jobRes) {
    res.status(404).end();
    return;
  }
  res.status(200).json(jobRes);
});

handler.post(async (req, res) => {
  console.log(req.body);
  if (!req.user) {
    res.redirect("/login");
    return;
  }

  const {
    query: { jobId },
  } = req;

  const _jobId = ObjectId(jobId);
  if (!_jobId) {
    res.status(400).json({ errorMsg: "Invalid ID" });
    return;
  }

  if (!req.body.bidId) {
    res.status(400).json({ errorMsg: "Need a bid ID" });
    return;
  }

  const _bidId = ObjectId(req.body.bidId);
  if (!_bidId) {
    res.status(400).json({ errorMsg: "Invalid ID" });
    return;
  }

  const jobRes = await req.db.collection("jobs").findOne({ _id: _jobId });
  if (!jobRes) {
    res.status(404).json({ errorMsg: "Couldn't find job" });
    return;
  }

  if (req.user.username !== jobRes.owner) {
    res.status(400).json({ errorMsg: "You aren't the owner" });
    return;
  }

  if (!jobRes.bids.map((b) => b.toHexString()).includes(_bidId.toHexString())) {
    res.status(400).json({ errorMsg: "This isn't even a bid for this job!" });
    return;
  }

  const bidRes = await req.db.collection("bids").findOne({ _id: _bidId });

  if (!bidRes) {
    res.status(400).json({ errorMsg: "Couldn't find bid" });
    return;
  }

  const jobUpdateRes = await req.db
    .collection("jobs")
    .updateOne(
      { _id: _jobId },
      { $set: { developer: bidRes.bidder, status: "closed" } }
    );

  //update all the bids

  jobRes.bids.map(async (bidId) => {
    const bidUpdateRes = await req.db
      .collection("bids")
      .updateOne(
        { _id: bidId },
        {
          $set: {
            status:
              bidId.toHexString() === req.body.bidId ? "active" : "expired",
          },
        }
      );
  });

  const userUpdateRes = await req.db
    .collection("users")
    .updateOne({ username: bidRes.bidder }, { $push: { devJobs: _jobId } });

  res.status(204).end();
});

export default handler;
