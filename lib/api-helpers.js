export const extractUser = (req) => {
  if (!req.user) return null;
  const { _id, name, username } = req.user;

  return { _id: _id.toHexString(), name, username };
};
