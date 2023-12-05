import * as oas30 from "schema-oas-v3-0";
import { DocumentInitializer } from "../document-context.js";
import { Document } from "./document.js";

export function factory({ documentUri, documentNode, options }: DocumentInitializer) {
  if (oas30.isSchemaDocument(documentNode)) {
    return new Document(documentUri, documentNode, options);
  }
}
