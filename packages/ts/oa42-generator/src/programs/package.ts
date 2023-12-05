import * as path from "path";
import * as yargs from "yargs";
import { DocumentContext } from "../documents/document-context.js";
import * as oas30 from "../documents/oas30/index.js";
import * as oas31 from "../documents/oas31/index.js";
import * as swagger2 from "../documents/swagger2/index.js";
import { generatePackage } from "../generators/index.js";

export function configurePackageProgram(argv: yargs.Argv) {
  return argv.command(
    "package [specification-url]",
    "create package from specification-url",
    (yargs) =>
      yargs
        .positional("specification-url", {
          description: "url to download specification from",
          type: "string",
        })
        .option("package-directory", {
          description: "where to output the package",
          type: "string",
        })
        .option("package-name", {
          description: "name of the package",
          type: "string",
        })
        .option("package-version", {
          description: "version of the package",
          type: "string",
        })
        .option("default-name", {
          description: "default name for types",
          type: "string",
          default: "schema-document",
        })
        .option("namer-maximum-iterations", {
          description: "maximum number of iterations for finding unique names",
          type: "number",
          default: 5,
        })
        .option("any-of-hack", {
          description: "quick-fix to make any of work with many types",
          type: "boolean",
          default: false,
        }),
    (argv) => main(argv as MainOptions),
  );
}

interface MainOptions {
  specificationUrl: string;
  packageDirectory: string;
  packageName: string;
  packageVersion: string;
  defaultName: string;
  namerMaximumIterations: number;
  anyOfHack: boolean;
}

async function main(options: MainOptions) {
  // read from options

  let specificationUrl: URL;
  if (/^\w+\:\/\//.test(options.specificationUrl)) {
    specificationUrl = new URL(options.specificationUrl);
  } else {
    specificationUrl = new URL("file://" + path.resolve(process.cwd(), options.specificationUrl));
  }
  const packageDirectoryPath = path.resolve(options.packageDirectory);
  const { packageName, packageVersion, defaultName, namerMaximumIterations, anyOfHack } = options;

  // setup document context

  const documentContext = new DocumentContext({
    defaultName,
    namerMaximumIterations,
    anyOfHack,
  });
  documentContext.registerFactory(swagger2.factory);
  documentContext.registerFactory(oas30.factory);
  documentContext.registerFactory(oas31.factory);

  // load api model

  await documentContext.loadFromUrl(specificationUrl);

  const apiModel = await documentContext.getApiModel();

  // generate code

  generatePackage(apiModel, {
    packageDirectoryPath,
    packageName,
    packageVersion,
    anyOfHack,
  });
}
