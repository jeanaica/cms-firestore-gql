declare module 'formidable-serverless' {
  export interface File {
    type: string;
    name: string;
    path: string;
    size: number;
  }

  export interface Fields {
    [fieldName: string]: string;
  }

  export interface Files {
    [filename: string]: File;
  }

  export class IncomingForm {
    parse(
      req: unknown,
      callback: (err: Error, fields: Fields, files: Files) => void
    ): void;
  }
}
