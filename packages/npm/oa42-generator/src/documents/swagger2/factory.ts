import * as swagger2 from "@jns42/swagger-v2";
import { DocumentInitializer } from "../document-context.js";
import { Document } from "./document.js";

export function factory({
  documentLocation,
  documentNode,
  configuration: options,
}: DocumentInitializer) {
  if (swagger2.isSchemaJson(documentNode)) {
    return new Document(documentLocation, documentNode, options);
  }
}
