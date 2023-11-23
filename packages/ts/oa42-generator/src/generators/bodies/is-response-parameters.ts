import * as models from "../../models/index.js";
import { itt, toCamel } from "../../utils/index.js";

export function* generateIsResponseParametersFunctionBody(
  apiModel: models.Api,
  operationResultModel: models.OperationResult,
) {
  const parameterModels = operationResultModel.headerParameters;

  for (const parameterModel of parameterModels) {
    const parameterSchemaId = parameterModel.schemaId;
    const parameterTypeName =
      parameterSchemaId == null ? parameterSchemaId : apiModel.names[parameterSchemaId];
    if (parameterTypeName == null) {
      continue;
    }

    const isParameterFunction = `is${parameterTypeName}`;

    const parameterPropertyName = toCamel(parameterModel.name);

    if (parameterModel.required) {
      yield itt`
        if(parameters.${parameterPropertyName} === undefined) {
          return false;
        }
      `;
    }

    yield itt`
      if(parameters.${parameterPropertyName} !== undefined && !validators.${isParameterFunction}(
        parameters.${parameterPropertyName}
      )) {
        return false;
      }
    `;
  }

  yield itt`
    return true;
  `;
}
