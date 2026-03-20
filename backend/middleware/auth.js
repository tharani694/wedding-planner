import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const getUser = async (req) => {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret_change_in_prod");
    const user = await User.findById(decoded.id).select("-password");
    return user;
  } catch {
    return null;
  }
};

export const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "dev_secret_change_in_prod", {
    expiresIn: "30d",
  });