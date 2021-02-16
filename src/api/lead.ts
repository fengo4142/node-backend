import { Router, Request, Response, NextFunction } from "express";

import { IRequest } from "@interfaces";
import Lead from "@db/models/Lead";

export class LeadRoutes {
  public router: Router;

  /**
   * Initialize the Routes
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  private list = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const leads = await Lead.getLeads(req);

      return res.status(200).json(leads);
    } catch (err) {
      return next(err);
    }
  };

  private getOne = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const { leadId } = req.params;
      const lead = await Lead.getLeadById(parseInt(leadId));
      if (!lead)
        return res
          .status(400)
          .json({ message: "No Lead existed with that id" });

      return res.status(200).json(lead);
    } catch (err) {
      return next(err);
    }
  };

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get("/", this.list);
    this.router.get("/:id", this.getOne);
  }
}

// Express.Router configuration
const routes = new LeadRoutes();
export default routes.router;
