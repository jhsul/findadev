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
  // if you are the user in question, get ALL the data!
  if (req.user.username !== username) {
    res.status(201).json({ user: extractUser({ user: userRes }) });
    return;
  }

  delete userRes.password;
  res.status(201).json({ user: userRes });
});

export default handler;
