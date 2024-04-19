import jwt from "jsonwebtoken";
import User from "../../DB/Models/user.model.js";

export const auth = () => {
  return async (req, res, next) => {
    try {
      const { accesstoken } = req.headers;
      if (!accesstoken)
        return next(new Error("please login first", { cause: 400 }));
      if (!accesstoken.startsWith(process.env.TOKEN_PREFIX))
        return next(new Error("invalid token prefix", { cause: 400 }));
      const token = accesstoken.split(process.env.TOKEN_PREFIX)[1];
      const decoderdData = jwt.verify(token, process.env.LOGIN_SIG);
      if (!decoderdData || !decoderdData.id)
        return next(new Error("invalid token payload", { cause: 400 }));
      //user check
      const findUser = await User.findById(
        decoderdData.id,
        "_id username email age gender role createdAt updatedAt "
      );
      if (!findUser)
        return next(new Error("please signUp first", { cause: 404 }));
      // authorization check
      // if (accessRoles.includes(findUser.role))
      //   return next(Error("you are not authorized", { cause: 401 }));

      req.authUser = findUser;
      next();
    } catch (error) {
      next(new Error("catch error in auth middleware", { cause: 500 }));
    }
  };
};
