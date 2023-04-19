import User from "../models/User.js";
import bcrypt from "bcryptjs"

const comparePassword = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (user) {
      const isValid = bcrypt.compareSync(password, user.password);
      return isValid ? { isValid, user } : { isValid }
    }
    return { isValid: false };
  } catch (error) {
    throw error;
  }
};

export default comparePassword;