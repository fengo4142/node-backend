const qs = require("qs");

import { Response, NextFunction } from "express";
import { IRequest } from "@interfaces";

const defaultLimit = 20;

async function parseQueryParams(
  req: IRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const query = qs.parse(req.query);
    const fields = parseSearchFields({ ...query });
    let sortOptions, filterOptions, autocompleteOptions;

    if (req.query.sort_by) {
      sortOptions = parseSortOptions(req.query.sort_by);
    }

    if (req.query.terms) {
      autocompleteOptions = { terms: req.query.terms };
    }

    if (fields) {
      filterOptions = await parseFilterOptions(fields);
    }

    req.sortOptions = sortOptions || [];
    req.filterOptions = filterOptions || [];
    req.paginationOptions = parsePaginationOptions(req) || 10;
    next();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to parse the query params");
  }
}

/******************************************************************

                      Private Functions

*******************************************************************/

function parseSortOptions(sortBy: any) {
  let sortArray = sortBy.split(",");
  return sortArray.map((sort: string) => {
    let field = sort.charAt(0) === "-" ? sort.substr(1) : sort;
    let sortOrder = sort.charAt(0) === "-" ? "DESC" : "ASC";
    let sortOperator = sort.charAt(0) === "-" ? "<=" : ">=";
    return { field: field, sortOrder: sortOrder, sortOperator: sortOperator };
  });
}

function parseFilterOptions(fiterOptions: any) {
  let filterOptionsData: any[] = [];
  let querybuilder = Object.keys(fiterOptions);
  Promise.all(
    querybuilder.map((filter: any) => {
      if (typeof fiterOptions[filter] === "object") {
        Promise.all(
          fiterOptions[filter].map((filterObj: any) => {
            let filters: any = addFilters(filterObj, filter);
            filterOptionsData.push(filters);
          })
        );
      } else {
        let filters = addFilters(fiterOptions[filter], filter);
        filterOptionsData.push(filters);
      }
    })
  );
  return filterOptionsData;
}

function parsePaginationOptions(req: any) {
  return {
    limit: req.query.limit || defaultLimit,
    offset: parseInt(req.query.offset) || 0,
    after_id: req.query.after_id,
  };
}

function parseSearchFields(fields: any) {
  delete fields.sort_by;
  delete fields.after_id;
  delete fields.term;
  delete fields.limit;
  delete fields.org_code;
  delete fields.export;
  delete fields.history;
  delete fields.offset;
  return fields;
}

function addFilters(filterObj: any, filter: any) {
  let filterData = filterObj.split(":");
  let filterOperator = getFilterOperator(filterData[0]);
  let filterValue = filterData.length === 1 ? filterData[0] : filterData[1];
  if (filterOperator === "LIKE") {
    filterData[0] === "start"
      ? (filterValue = filterValue + "%")
      : (filterValue = "%" + filterValue + "%");
  }
  return { field: filter, value: filterValue, operator: filterOperator };
}

function getFilterOperator(operator: string) {
  let operatorVal;
  switch (operator) {
    case "contains":
      operatorVal = "LIKE";
      break;
    case "exact":
      operatorVal = "=";
      break;
    case "start":
      operatorVal = "LIKE";
      break;
    case "gt":
      operatorVal = ">";
      break;
    case "gte":
      operatorVal = ">=";
      break;
    case "lt":
      operatorVal = "<";
      break;
    case "lte":
      operatorVal = "<=";
      break;
    case "eq":
      operatorVal = "=";
      break;
    default:
      operatorVal = "=";
  }
  return operatorVal;
}

export { parseQueryParams, parseSortOptions };
