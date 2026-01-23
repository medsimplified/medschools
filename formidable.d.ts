declare module 'formidable' {
  import { IncomingMessage } from 'http';

  export interface File {
    size: number;
    filepath: string;
    newFilename: string;
    mimetype: string;
    mtime: Date;
    originalFilename: string;
  }

  export interface Fields {
    [key: string]: string | string[];
  }

  export interface Files {
    [key: string]: File | File[];
  }

  export interface FormidableOptions {
    uploadDir?: string;
    keepExtensions?: boolean;
    multiples?: boolean;
    maxFileSize?: number;
    maxFields?: number;
    maxFieldsSize?: number;
    hashAlgorithm?: string | false;
    encoding?: string;
    filename?: (name: string, dec: any, file: any) => string;
    [key: string]: any;
  }

  export class IncomingForm {
    constructor(options?: FormidableOptions);
    parse(req: IncomingMessage, callback: (err: any, fields: Fields, files: Files) => void): void;
    [key: string]: any;
  }

  export default function formidable(options?: FormidableOptions): IncomingForm;
}

// Augment the Files type to better support optional chaining and indexing
declare global {
  namespace FormidableModule {
    interface FileArray extends Array<any> {
      [0]?: any;
    }
  }
}
