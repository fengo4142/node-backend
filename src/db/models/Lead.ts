import BaseModel from "./BaseModel";

class Lead extends BaseModel {
  readonly id!: number;
  name: string;
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
      deleted: { type: "boolean" },
    },
  };

  // Where to look for models classes.
  static modelPaths = [__dirname];

  async $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

export default Lead;
