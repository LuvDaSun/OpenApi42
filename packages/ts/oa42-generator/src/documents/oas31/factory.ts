import * as oas31 from "schema-oas-v3-1";
import { DocumentInitializer } from "../document-context.js";
import { Document } from "./document.js";

export function factory({ documentUri, documentNode, options }: DocumentInitializer) {
  if (oas31.isSchemaDocument(documentNode)) {
    return new Document(documentUri, documentNode, options);
  }
}
