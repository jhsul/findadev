import nc from "next-connect";
import { ObjectId } from "mongodb";

import all from "../../../middlewares/all";

const handler = nc();
handler.use(all);

handler.get(async (req, res) => {
  const {
    query: { bidId },
  } = req;

  const _id = ObjectId(bidId);
  if (!_id) {
    res.status(400).json({ errorMsg: "Bad ID" });
    return;
  }

  const bidRes = await req.db.collection("bids").findOne({ _id });

  if (!bidRes) {
    res.status(404).json({ errorMsg: "Couldn't find bid" });
    return;
  }

  res.status(200).json(bidRes);
});

export default handler;
