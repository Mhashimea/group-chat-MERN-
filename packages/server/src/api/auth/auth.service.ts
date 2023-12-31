import bcrypt from "bcrypt";
import { userCreationModel } from "../users/model";
import { UserService } from "../users/user.service";
import Users from "./../../database/entities/Users";
import { AuthModelI } from "./model";
import jwt from "jsonwebtoken";
import ApiError from "../../middlewares/api-error";
import httpStatus from "http-status";

const saltRounds = 10;
const userService = new UserService();

export default class AuthenticationService {
  /**
   * Login user with email and password
   * @param params
   * @returns
   */
  public async login(params: AuthModelI) {
    const { email, password } = params;

    // check if email and password are provided
    if (!email || !password)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Email and password are required"
      );

    // check if user exists
    const user = await Users.findOne({ email });
    if (!user)
      throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, "User not found");

    // check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new ApiError(
        httpStatus.UNPROCESSABLE_ENTITY,
        "Invalid credentials"
      );

    // fetch the user details
    const userDetails = await userService.getUserByEmail(email);
    const token = await this.createToken(userDetails);

    return {
      token,
      user: userDetails,
    };
  }

  /**
   * Register user
   * @param params
   * @returns
   */
  public async register(params: userCreationModel) {
    const { name, email, password } = params;

    // check if user already exists
    const user = await userService.getUserByEmail(email);
    if (user)
      throw new ApiError(
        httpStatus.UNPROCESSABLE_ENTITY,
        "User already exists"
      );

    const encryptPassword = await this.setEncrypt(password);
    const payload = {
      name,
      email,
      password: encryptPassword,
    };
    const newUser = new Users(payload);
    return await newUser.save();
  }

  /**
   * Create session token
   * @param payload
   * @returns
   */
  public async createToken(payload: any) {
    const privateKey = process.env.JWT_SECRET;
    if (!privateKey) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "JWT secret not found"
      );
    }

    return jwt.sign(payload.toJSON(), privateKey, { expiresIn: "1d" });
  }

  /**
   * Get session
   * @param request
   */
  public async getSession(request: any) {
    const jwtVerify: any = await this.verifyToken(
      request.headers.authorization
    );
    const { email } = jwtVerify;
    const user = await userService.getUserByEmail(email);

    return user;
  }

  /**
   * Encrypt username using sha1 algorithm
   * @param {*} text
   */
  setEncrypt = (password: string) => {
    return bcrypt
      .genSalt(saltRounds)
      .then((salt: any) => bcrypt.hash(password, salt))
      .then((hash: any) => hash)
      .catch((err: any) => console.error(err.message));
  };

  /**
   * Verify JWT token
   */
  verifyToken = (token: string) => {
    const privateKey = process.env.JWT_SECRET;
    if (!privateKey) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "JWT secret not found"
      );
    }

    return jwt.verify(token, privateKey, (err: any, decoded: any) => {
      if (err) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Invalid token");
      }
      return decoded;
    });
  };
}
