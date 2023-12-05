import { Router } from "goodrouter";
import { Authentication } from "./authentication.js";
import { Path } from "./path.js";

export interface Api {
  uri: URL;
  paths: Array<Path>;
  authentication: Array<Authentication>;
  schemas: Record<string, any>;
  names: Record<string, string>;
  router: Router<number>;
}
