import { loadYAML } from "../utils/index.js";
import { DocumentBase } from "./document-base.js";

export interface DocumentOptions {
  defaultName: string;
  namerMaximumIterations: number;
  anyOfHack: boolean;
}

export interface DocumentInitializer<N = unknown> {
  documentUri: URL;
  documentNode: N;
  options: DocumentOptions;
}

export type DocumentFactory<N = unknown> = (
  initializer: DocumentInitializer<N>,
) => DocumentBase<N> | undefined;

export class DocumentContext {
  private factories = new Array<DocumentFactory>();
  private document?: DocumentBase;

  constructor(private readonly options: DocumentOptions) {
    //
  }

  public registerFactory(factory: DocumentFactory) {
    this.factories.push(factory);
  }

  public async loadFromUrl(documentUri: URL) {
    documentUri = new URL("", documentUri);

    const documentNode = await loadYAML(documentUri);
    this.loadFromDocument(documentUri, documentNode);
  }

  public loadFromDocument(documentUri: URL, documentNode: unknown) {
    documentUri = new URL("", documentUri);

    for (const factory of this.factories) {
      const document = factory({
        documentUri,
        documentNode,
        options: this.options,
      });
      if (document != null) {
        this.document = document;
        break;
      }
    }
  }

  public getApiModel() {
    return this.document!.getApiModel();
  }
}
