import fs from "fs";
import * as jns42generator from "jns42-generator";
import path from "path";
import * as models from "../models/index.js";
import { NestedText, flattenNestedText, splitIterableText } from "../utils/index.js";
import { generateBrowserTsCode } from "./files/browser-ts.js";
import { generateClientTsCode } from "./files/client-ts.js";
import { generateMainTestTsCode } from "./files/main-test-ts.js";
import { generateMainTsCode } from "./files/main-ts.js";
import { generatePackageJsonData } from "./files/package-json.js";
import { generateParametersTsCode } from "./files/parameters-ts.js";
import { generateServerTsCode } from "./files/server-ts.js";
import { generateTsconfigJsonData } from "./files/tsconfig-json.js";

export interface PackageOptions {
  name: string;
  version: string;
  directoryPath: string;
}

export function generatePackage(apiModel: models.Api, options: PackageOptions) {
  fs.mkdirSync(options.directoryPath, { recursive: true });

  const specification = {
    names: apiModel.names,
    nodes: apiModel.schemas,
  };

  {
    const data = generatePackageJsonData(options.name, options.version);
    const filePath = path.join(options.directoryPath, "package.json");
    fs.writeFileSync(filePath, JSON.stringify(data, undefined, 2));
  }

  {
    const data = generateTsconfigJsonData();
    const filePath = path.join(options.directoryPath, "tsconfig.json");
    fs.writeFileSync(filePath, JSON.stringify(data, undefined, 2));
  }

  {
    const code = generateMainTsCode(apiModel);
    const filePath = path.join(options.directoryPath, "main.ts");
    writeCodeToFile(filePath, code);
  }

  {
    const code = generateBrowserTsCode(apiModel);
    const filePath = path.join(options.directoryPath, "browser.ts");
    writeCodeToFile(filePath, code);
  }

  {
    const code = generateParametersTsCode(apiModel);
    const filePath = path.join(options.directoryPath, "parameters.ts");
    writeCodeToFile(filePath, code);
  }

  {
    const code = jns42generator.generateTypesTsCode(specification);
    const filePath = path.join(options.directoryPath, "types.ts");
    writeCodeToFile(filePath, code);
  }

  {
    const code = jns42generator.generateValidatorsTsCode(specification);
    const filePath = path.join(options.directoryPath, "validators.ts");
    writeCodeToFile(filePath, code);
  }

  {
    const code = jns42generator.generateParsersTsCode(specification);
    const filePath = path.join(options.directoryPath, "parsers.ts");
    writeCodeToFile(filePath, code);
  }

  {
    const code = generateClientTsCode(apiModel);
    const filePath = path.join(options.directoryPath, "client.ts");
    writeCodeToFile(filePath, code);
  }

  {
    const code = generateServerTsCode(apiModel);
    const filePath = path.join(options.directoryPath, "server.ts");
    writeCodeToFile(filePath, code);
  }

  {
    const code = generateMainTestTsCode(apiModel);
    const filePath = path.join(options.directoryPath, "main.test.ts");
    writeCodeToFile(filePath, code);
  }
}

function writeCodeToFile(filePath: string, code: NestedText) {
  const fd = fs.openSync(filePath, "w");

  try {
    for (let text of splitIterableText(flattenNestedText(code))) {
      text = text.trim();
      if (text.length === 0) {
        continue;
      }
      text += "\n";
      fs.writeFileSync(fd, text);
    }
  } finally {
    fs.closeSync(fd);
  }
}
