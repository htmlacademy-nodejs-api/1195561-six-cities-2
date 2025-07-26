import { WriteStream } from 'node:fs';
import { createWriteStream } from 'node:fs';
import { FileWriter } from './file-writer.interface.js';
import {
  FILE_WRITE_FLAG,
  UTF8_ENCODING,
  AUTO_CLOSE_ENABLED,
  DRAIN_RESOLVE_VALUE,
  DRAIN_EVENT,
} from '../../constants/index.js';

export class TSVFileWriter implements FileWriter {
  private stream: WriteStream;

  constructor(filename: string) {
    this.stream = createWriteStream(filename, {
      flags: FILE_WRITE_FLAG,
      encoding: UTF8_ENCODING,
      autoClose: AUTO_CLOSE_ENABLED,
    });
  }

  public async write(row: string): Promise<unknown> {
    const writeSuccess = this.stream.write(`${row}\n`);

    if (!writeSuccess) {
      return new Promise((resolve) => {
        this.stream.once(DRAIN_EVENT, () => resolve(DRAIN_RESOLVE_VALUE));
      });
    }

    return Promise.resolve();
  }
}
