import { StatusCode } from "oa42-lib";
import { Body } from "./body.js";
import { Parameter } from "./parameter.js";

export interface OperationResult {
  uri: URL;
  description: string;
  statusKind: string;
  statusCodes: StatusCode[];
  headerParameters: Parameter[];
  bodies: Body[];
}
