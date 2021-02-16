import * as cors from "cors";
import * as express from "express";
import * as helmet from "helmet";
import * as http from "http";

import * as api from "./api";
import { errorHandler, parseQueryParams } from "@middlewares";

import { getLogger, logHandler } from "./utils";
export class Server {
  private app: express.Application;
  private server: http.Server;
  private port: string | number;
  private log: any;

  constructor() {
    this.port = process.env.PORT || 5000;
    this.log = getLogger(__dirname, __filename);
    this.app = express();

    this.app
      .use(helmet())
      .use(cors())
      .use(express.json())
      .use(express.urlencoded({ extended: false }))
      .use(logHandler);
  }

  private async registerApi() {
    await api.default.initApi(this.app);
  }

  public async start() {
    return new Promise(async (resolve, reject) => {
      try {
        this.app.use(errorHandler);
        this.app.get("*", parseQueryParams);

        await this.registerApi();

        this.server = http.createServer(this.app);

        this.server.listen(this.port, () => {
          this.log.info(`Server listening on http://localhost:${this.port}`);
          return resolve(true);
        });
      } catch (error) {
        this.log.error(error.message);
        return reject(error);
      }
    });
  }

  public stop() {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.server) return resolve("No server is running.");

        await this.server.close();

        this.server.on("close", () => {
          return resolve(true);
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
}

const server = new Server();
export default server;
