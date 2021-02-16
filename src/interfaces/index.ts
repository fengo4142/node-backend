import { Request } from "express";

export interface IRequest extends Request {
  sortOptions: any;
  filterOptions: any;
  paginationOptions: any;
}
