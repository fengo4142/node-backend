import { IRequest } from "@interfaces";
import BaseModel from "./BaseModel";
class Lead extends BaseModel {
  readonly lead_id!: number;
  name: string;
  email: string;
  phone: string;
  from_zip: string;
  from_state: string;
  to_zip: string;
  to_city: string;
  to_state: string;
  movesize: number;
  movedate: string;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  static tableName = "lead";

  static jsonSchema = {
    type: "object",
    required: ["name"],

    properties: {
      id: { type: "integer" },
      name: { type: "string", minLength: 1, maxLength: 60 },
      email: { type: "string", minLength: 5, maxLength: 255 },
      phone: { type: "string", minLength: 9, maxLength: 20 },
      from_zip: { type: "string", minLength: 1, maxLength: 10 },
      from_state: { type: "string" },
      to_zip: { type: "string", minLength: 1, maxLength: 10 },
      to_state: { type: "string" },
      to_city: { type: "string" },
      movesize: { type: "integer" },
      movedate: { type: "date" },
      deleted: { type: "boolean" },
    },
  };

  // Where to look for models classes.
  static modelPaths = [__dirname];

  async $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static getLeads(req: IRequest): Promise<Lead[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { offset = 0, limit = 100 } = req.filterOptions;
        const leads = Lead.query().offset(offset).limit(limit);

        return resolve(leads);
      } catch (error) {
        return reject(error);
      }
    });
  }

  static getLeadById(id: number): Promise<Lead> {
    return new Promise(async (resolve, reject) => {
      try {
        const lead = await Lead.query().select().findById(id).limit(1).first();

        return resolve(lead);
      } catch (error) {
        return reject(error);
      }
    });
  }

  static createLead(LeadData: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const lead = await Lead.query().insert(LeadData).returning("*");
        return resolve(lead);
      } catch (error) {
        // error.message = handleErrorCreateLead(error);

        return reject(error);
      }
    });
  }

  static updateLead(id: number, LeadData: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const lead = await Lead.query().patchAndFetchById(id, LeadData);
        return resolve(lead);
      } catch (error) {
        console.log(error);
        return reject(error);
      }
    });
  }

  static deleteLead(id: number): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const lead = await Lead.query().findById(id);
        await Lead.query().deleteById(id);

        return resolve(lead);
      } catch (error) {
        return reject(error);
      }
    });
  }
}

export default Lead;
