import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import apiEndpoints from "./api";
import httpModule from "http";
import { connectDB } from "./database";
import * as dotenv from "dotenv";
import SocketConnection from "./api/message/message.socket";
import { errorConverter } from "./middlewares/error-converter";
import ApiError from "./middlewares/api-error";
import httpStatus from "http-status";

// configure dotenv
dotenv.config();

class App {
  private app: express.Application = express();
  public http: any = httpModule.createServer(this.app);
  private socket = new SocketConnection();

  constructor() {
    this.registerServer();
    this.registerDatbase();
    this.registerSocket();
  }

  registerServer() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(function (req: any, res: any, next: any) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });
    this.app.use(apiEndpoints.path, apiEndpoints.handler);

    // Handle 404 error
    // Send back a 404 error for any unknown api request
    this.app.use((_req, _res, next) => {
      next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
    });

    // Convert the errors to the ApiError format
    // So that we can send unified error payloads
    this.app.use(errorConverter);
  }

  // Connect to the database
  registerDatbase() {
    connectDB(process.env.MONGODB_URI || "");
  }

  // Register socket connection
  registerSocket() {
    this.socket.socketConnection(this.http);
  }
}

export default new App().http;
