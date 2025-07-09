import { FileRead } from './file-read.interface.js';
import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';

export class TsvFileReader extends EventEmitter implements FileRead {
  constructor(private readonly filename: string) {
    super();
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        this.emit('line', completeRow);
      }
    }

    this.emit('end', importedRowCount);
  }
}
