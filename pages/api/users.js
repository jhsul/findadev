import nc from "next-connect";
import isEmail from "validator/lib/isEmail";
import normalizeEmail from "validator/lib/normalizeEmail";
import bcrypt from "bcryptjs";
import all from "../../middlewares/all";
import { extractUser } from "../../lib/api-helpers";

const handler = nc();

handler.use(all);

handler.post(async (req, res) => {
  //res.status(200).send("hello");
  console.log(req.body);

  if (
    !req.body.name ||
    !req.body.username ||
    !req.body.email ||
    !req.body.password ||
    !req.body.confirmPass
  ) {
    res.status(400).json({ errorMsg: "Missing field(s)" });
    return;
  }

  const { name, username, password, confirmPass } = req.body;

  if (password !== confirmPass) {
    res.status(400).json({ errorMsg: "Passwords do not match" });
    return;
  }

  const email = normalizeEmail(req.body.email);

  if (!isEmail(email)) {
    res.status(400).json({ errorMsg: "Invalid email address" });
    return;
  }

  if ((await req.db.collection("users").countDocuments({ username })) > 0) {
    res.status(403).json({ errorMsg: "Username already in use" });
    return;
  }

  if ((await req.db.collection("users").countDocuments({ email })) > 0) {
    res.status(403).send("Email already in use");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await req.db
    .collection("users")
    .insertOne({ name, username, email, password: hashedPassword })
    .then(({ ops }) => ops[0]);

  req.logIn(user, (err) => {
    if (err) throw err;
    res.status(201).json({
      user: extractUser(req.user),
    });
  });

  res.status(500).json({ errorMsg: "Some fuck shit happened, not sure" });
  return;
});

export default handler;
