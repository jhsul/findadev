import nc from "next-connect";
import all from "../../middlewares/all";
import passport from "../../middlewares/passport";
import { extractUser } from "../../lib/api-helpers";

const handler = nc();

handler.use(all);

handler.post(passport.authenticate("local"), (req, res) => {
  res.json({ user: extractUser(req.user) });
});

handler.delete((req, res) => {
  console.log("Logging out");
  req.logOut();
  res.status(204).end();
});

export default handler;
