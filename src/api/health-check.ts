import { Router, Request, Response, NextFunction } from "express";

export class HealthCheckRoutes {
  public router: Router;

  /**
   * Initialize the Routes
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  private healthCheck = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    return res.status(200).json({ hello: "Hello 😄!" });
  };

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get("/", this.healthCheck);
  }
}

// Express.Router configuration
const routes = new HealthCheckRoutes();
export default routes.router;
