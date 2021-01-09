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

  const delRes = await req.db.collection("jobs").deleteOne({ _id });
  res.status(204).end();
});

export default handler;
