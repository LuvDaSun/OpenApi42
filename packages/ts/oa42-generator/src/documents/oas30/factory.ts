import * as oas30 from "@jns42/oas-v3-0";
import { DocumentInitializer } from "../document-context.js";
import { Document } from "./document.js";

export function factory({
  documentUri,
  documentNode,
  configuration: options,
}: DocumentInitializer) {
  if (oas30.isSchemaDocument(documentNode)) {
    return new Document(documentUri, documentNode, options);
  }
}
