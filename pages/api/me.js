import nc from "next-connect";

import all from "../../middlewares/all";
import { extractUser } from "../../lib/api-helpers";

const handler = nc();
handler.use(all);
handler.get(async (req, res) => res.json({ user: extractUser(req) }));

export default handler;
