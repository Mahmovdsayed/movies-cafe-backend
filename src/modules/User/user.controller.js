import User from "../../../DB/Models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinaryConnection from "../../utils/cloudinary.js";

/// ================= SIGNUP API =================
export const signUpHandeler = async (req, res, next) => {
  const { username, email, password, age, gender, firstName, secondName } =
    req.body;
  // email check
  const isEmailExists = await User.findOne({ email });
  if (isEmailExists)
    return next(new Error("Email is already exists", { cause: 409 }));

  // username check
  const isUserNameExists = await User.findOne({ username });
  if (isUserNameExists)
    return next(new Error("username is already exists", { cause: 409 }));

  //hash password
  const hashPass = bcrypt.hashSync(password, +process.env.SALT_ROUNDS);

  const newUser = await User.create({
    username,
    email,
    password: hashPass,
    age,
    gender,
    firstName,
    secondName,
  });
  return res.status(201).json({
    success: true,
    message: "User created successfully",
  });
};

/// ================= SIGNIN API =================
export const signInHandeler = async (req, res, next) => {
  const { email, password } = req.body;
  // email check
  const isEmailExists = await User.findOne({ email });
  if (!isEmailExists)
    return next(new Error("invalid login credentials", { cause: 404 }));

  //hash password
  const isPassMatched = bcrypt.compareSync(password, isEmailExists.password);
  if (!isPassMatched)
    return next(new Error("invalid login credentials", { cause: 404 }));
  // user Data 
  const userData = {
    _id: isEmailExists._id,
    email: isEmailExists.email,
    username: isEmailExists.username,
    firstName: isEmailExists.firstName,
    secondName: isEmailExists.secondName,
    verifed: isEmailExists.verifed,
    role: isEmailExists.role,
    image: isEmailExists.image,
    gender: isEmailExists.gender
  };
  // generate userToken (access Token)
  const token = jwt.sign(
    {
      id: isEmailExists._id,
      userEmail: isEmailExists.email,
      userName: isEmailExists.username,
      firstName: isEmailExists.firstName,
      secoundName: isEmailExists.secondName,
      verifed: isEmailExists.verifed,
      role: isEmailExists.role,
      Userimage: isEmailExists.image
    },
    process.env.LOGIN_SIG,
    { expiresIn: "365d" }
  );
  return res.status(200).json({
    success: true,
    message: "User LoggedIn successfully",
    token,
    userData
  });
};

/// ================= USERDATA API =================
export const getUserProfile = async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findOne({ username: userId }).select([
    "-password",
    "-email",
    "-_id",
  ]);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });
  res.json({
    success: true,
    message: "done",
    data: user,
  });
};

/// ============ UPDATE ACCOUNT========================
export const updateAccount = async (req, res, next) => {
  const { username, email, age, gender, firstName, secondName } = req.body;
  const { _id } = req.authUser;
  // email check
  const isEmailExists = await User.findOne({ email });
  if (isEmailExists)
    return next(new Error("Email is already exists", { cause: 409 }));

  // username check
  const isUserNameExists = await User.findOne({ username });
  if (isUserNameExists)
    return next(new Error("username is already exists", { cause: 409 }));
  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      username,
      email,
      age,
      gender,
      firstName,
      secondName,
      banner,
    },
    { new: true }
  );
  if (!updateUser) return next(new Error("update fail"));
  res.status(200).json({
    success: true,
    message: "done",
    updateUser,
  });
};

/// ================ DELETE ACCOUNT====================
export const deleteAccount = async (req, res, next) => {
  const { _id } = req.authUser;
  const deleteUser = await User.findByIdAndDelete({ _id });
  if (!deleteUser) return next(new Error("delete fail"));
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
};
