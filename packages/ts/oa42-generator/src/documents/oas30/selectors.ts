import { methods } from "oa42-lib";
import * as oas from "schema-oas-v3-0";
import { appendToPointer } from "../../utils/pointer.js";

export function selectSchemas(pointer: string, document: oas.SchemaDocument) {
  return selectFromDocument(pointer);

  function* selectFromDocument(pointer: string) {
    for (const [path, pathObject] of Object.entries(document.paths)) {
      yield* selectFromPath(appendToPointer(pointer, "paths", path), pathObject);
    }

    for (const [schema, schemaObject] of Object.entries(document.components?.schemas ?? {})) {
      yield* selectFromSchema(
        appendToPointer(pointer, "components", "schemas", schema),
        schemaObject,
      );
    }

    for (const [requestBody, requestBodyObject] of Object.entries(
      document.components?.requestBodies ?? {},
    )) {
      yield* selectFromRequestBody(
        appendToPointer(pointer, "components", "requestBodies", requestBody),
        requestBodyObject,
      );
    }

    for (const [response, responseObject] of Object.entries(document.components?.responses ?? {})) {
      yield* selectFromResponse(
        appendToPointer(pointer, "components", "responses", response),
        responseObject,
      );
    }

    for (const [parameter, parameterObject] of Object.entries(
      document.components?.parameters ?? {},
    )) {
      yield* selectFromParameter(
        appendToPointer(pointer, "components", "parameters", parameter),
        parameterObject,
      );
    }

    for (const [header, headerObject] of Object.entries(document.components?.headers ?? {})) {
      yield* selectFromHeader(
        appendToPointer(pointer, "components", "headers", header),
        headerObject,
      );
    }
  }

  function* selectFromPath(pointer: string, pathObject: unknown) {
    if (oas.isReference(pathObject)) {
      return;
    }

    if (!oas.isPathItem(pathObject)) {
      return;
    }

    for (const [parameter, parameterObject] of Object.entries(pathObject.parameters ?? {})) {
      yield* selectFromParameter(
        appendToPointer(pointer, "parameters", parameter),
        parameterObject,
      );
    }

    for (const method of Object.values(methods)) {
      const operationObject = pathObject[method];

      yield* selectFromOperation(appendToPointer(pointer, method), operationObject);
    }
  }

  function* selectFromOperation(pointer: string, operationObject: unknown) {
    if (!oas.isOperation(operationObject)) {
      return;
    }

    for (const [parameter, parameterObject] of Object.entries(operationObject.parameters ?? [])) {
      yield* selectFromParameter(
        appendToPointer(pointer, "parameters", parameter),
        parameterObject,
      );
    }

    for (const [response, responseObject] of Object.entries(operationObject.responses ?? {})) {
      yield* selectFromResponse(appendToPointer(pointer, "responses", response), responseObject);
    }

    if (operationObject.requestBody) {
      yield* selectFromRequestBody(
        appendToPointer(pointer, "requestBody"),
        operationObject.requestBody,
      );
    }
  }

  function* selectFromRequestBody(pointer: string, requestBodyObject: oas.RequestBodiesAZAZ09) {
    if (oas.isReference(requestBodyObject)) {
      return;
    }

    for (const [contentType, contentObject] of Object.entries(requestBodyObject.content)) {
      yield* selectFromMediaTypeObject(
        appendToPointer(pointer, "content", contentType),
        contentObject,
      );
    }
  }

  function* selectFromMediaTypeObject(
    pointer: string,
    mediaTypeObject: oas.RequestBodyContentAdditionalProperties,
  ) {
    if (oas.isReference(mediaTypeObject)) {
      return;
    }

    yield* selectFromSchema(appendToPointer(pointer, "schema"), mediaTypeObject.schema);
  }

  function* selectFromResponse(responsePointer: string, responseObject: unknown) {
    if (oas.isReference(responseObject)) {
      return;
    }

    if (!oas.isResponse(responseObject)) {
      return;
    }

    for (const [contentType, contentObject] of Object.entries(responseObject.content ?? {})) {
      yield* selectFromSchema(
        appendToPointer(responsePointer, "content", contentType, "schema"),
        contentObject.schema,
      );
    }

    for (const [header, headerObject] of Object.entries(responseObject.headers ?? {})) {
      yield* selectFromHeader(appendToPointer(responsePointer, "headers", header), headerObject);
    }
  }

  function* selectFromParameter(pointer: string, parameterObject: oas.Reference | oas.Parameter) {
    if (oas.isReference(parameterObject)) return;

    yield* selectFromSchema(appendToPointer(pointer, "schema"), parameterObject.schema);
  }

  function* selectFromHeader(headerPointer: string, headerObject: oas.Reference | oas.Header) {
    if (oas.isReference(headerObject)) {
      return;
    }

    yield* selectFromSchema(appendToPointer(headerPointer, "schema"), headerObject.schema);
  }

  function* selectFromSchema(
    schemaPointer: string,
    schemaObject: oas.Reference | oas.DefinitionsSchema | undefined,
  ) {
    if (schemaObject == null) {
      return;
    }

    yield [schemaPointer, schemaObject] as const;
  }

  // function* selectFromSchema(
  //   schemaObject:
  //     | oas.Reference
  //     | oas.SchemaObject
  //     | undefined,
  //   pointer: string,
  // ): Iterable<{
  //   schemaObject: oas.SchemaObject;
  //   pointerParts: string[];
  // }> {
  //   if (!schemaObject) return;
  //   if (oas.isReference(schemaObject)) return;

  //   yield {
  //     schemaObject,
  //     pointerParts,
  //   };

  //   for (const [property, propertyObject] of Object.entries(
  //     schemaObject.properties ?? {},
  //   )) {
  //     yield* selectFromSchema(propertyObject, [
  //       ...pointerParts,
  //       "properties",
  //       property,
  //     ]);
  //   }

  //   for (const [allOf, allOfObject] of Object.entries(
  //     schemaObject.allOf ?? {},
  //   )) {
  //     yield* selectFromSchema(allOfObject, [...pointerParts, "allOf", allOf]);
  //   }

  //   for (const [anyOf, anyOfObject] of Object.entries(
  //     schemaObject.anyOf ?? {},
  //   )) {
  //     yield* selectFromSchema(anyOfObject, [...pointerParts, "anyOf", anyOf]);
  //   }

  //   for (const [oneOf, oneOfObject] of Object.entries(
  //     schemaObject.oneOf ?? {},
  //   )) {
  //     yield* selectFromSchema(oneOfObject, [...pointerParts, "oneOf", oneOf]);
  //   }

  //   if ("items" in schemaObject) {
  //     if (Array.isArray(schemaObject.items)) {
  //       for (const [item, itemObject] of Object.entries(schemaObject.items)) {
  //         yield* selectFromSchema(itemObject, [...pointerParts, "items", item]);
  //       }
  //     } else {
  //       yield* selectFromSchema(schemaObject.items, [...pointerParts, "items"]);
  //     }
  //   }

  //   if (typeof schemaObject.additionalProperties === "object") {
  //     yield* selectFromSchema(schemaObject.additionalProperties, [
  //       ...pointerParts,
  //       "additionalProperties",
  //     ]);
  //   }

  //   yield* selectFromSchema(schemaObject.not, [...pointerParts, "not"]);
  // }
}
