import nc from "next-connect";

import all from "../../../middlewares/all";
import { extractUser } from "../../../lib/api-helpers";

const handler = nc();
handler.use(all);

handler.get(async (req, res) => {
  const { username } = req.query;

  const userRes = await req.db.collection("users").findOne({ username });
  if (!userRes) {
    res.status(404).end();
    return;
  }
  // this is retarded but it must be done
  res.status(201).json({ user: extractUser({ user: userRes }) });
});

export default handler;
