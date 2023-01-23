const md5 = require("md5");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

const getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (error) {
    console.log(error);
    next(error);
  }
  if (!users) {
    return res.status(404).json({ message: "No users found!" });
  }
  return res.status(200).json({ users });
};

const signUp = async (req, res, next) => {
  let { name, email, password } = req.body;
  try {
    let hashedPassword = md5(password);
    const data = await User.findOne({ email: email });
    if (data) {
      res.status(400).json({
        message: "user already exists!",
        error: true,
        data: null,
      });
    } else {
      await User.insertMany({
        name,
        email,
        password: hashedPassword,
        blogs:[]
      });
      res.status(200).json({
        message: "user signup successful!",
        error: false,
        data: { name, email, password,blogs },
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const logIn = async (req, res, next) => {
  let { email, password } = req.body;
  try {
    let hashedPassword = md5(password);
    const data = await User.findOne({ email: email, password: hashedPassword });
    if (data) {
      let payload = { email };
      let token = jwt.sign(payload, process.env.SECRECT_KEY, {
        expiresIn: "10h",
      });
      res.status(200).json({
        error: false,
        message: "Login successful",
        data: { payload, token },
      });
    } else {
      res.status(400).json({
        message: "Invalid email or password",
        error: true,
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  getAllUser,
  signUp,
  logIn,
  
};
