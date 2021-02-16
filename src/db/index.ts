import * as Knex from "knex";
import { Model } from "objection";

const knexFile = require("./knexfile");

const { NODE_ENV } = process.env;

let knexConfig = knexFile.development;

if (NODE_ENV === "production") knexConfig = knexFile.production;
if (NODE_ENV === "test") knexConfig = knexFile.test;

const knex = Knex(knexConfig);

Model.knex(knex);

export default knex;
