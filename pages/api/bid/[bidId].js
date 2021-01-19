import nc from "next-connect";
import { ObjectId } from "mongodb";

import all from "../../../middlewares/all";

const handler = nc();
handler.use(all);

handler.get(async (req, res) => {});

export default handler;
