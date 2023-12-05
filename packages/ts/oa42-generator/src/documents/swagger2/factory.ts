import * as swagger2 from "schema-swagger-v2";
import { DocumentInitializer } from "../document-context.js";
import { Document } from "./document.js";

export function factory({ documentUri, documentNode, options }: DocumentInitializer) {
  if (swagger2.isSchemaJson(documentNode)) {
    return new Document(documentUri, documentNode, options);
  }
}
