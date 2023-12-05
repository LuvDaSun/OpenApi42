import * as oas from "schema-swagger-v2";
import * as models from "../../models/index.js";
import { DocumentBase } from "../document-base.js";

export class Document extends DocumentBase<oas.SchemaJson> {
  public getApiModel(): Promise<models.Api> {
    throw new Error("Method not implemented.");
  }
}
