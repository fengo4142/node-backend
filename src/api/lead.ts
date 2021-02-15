import { Router, Request, Response, NextFunction } from "express";
import Lead from "@db/models/Lead";

export class LeadRoutes {
  public router: Router;

  /**
   * Initialize the Routes
   */
  constructor() {
    this.router = Router();
  }
}

// Express.Router configuration
const routes = new LeadRoutes();
export default routes.router;
