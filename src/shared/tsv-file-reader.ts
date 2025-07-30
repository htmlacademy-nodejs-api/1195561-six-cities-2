import { FileRead } from './file-read.interface.js';
import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';
import { NEWLINE } from './types/index.js';

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

      while ((nextLinePosition = remainingData.indexOf(NEWLINE)) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);

        nextLinePosition += 1;
        remainingData = remainingData.slice(nextLinePosition);

        // Пропускаем пустые строки
        const trimmedRow = completeRow.trim();

        if (trimmedRow.length > 0) {
          importedRowCount += 1;

          await new Promise((resolve) => {
            this.emit('line', completeRow, resolve);
          });
        }
      }
    }

    // Обрабатываем последнюю строку, если она не заканчивается символом новой строки
    if (remainingData.trim().length > 0) {
      importedRowCount += 1;

      this.emit('line', `${remainingData}${NEWLINE}`);
    }

    this.emit('end', importedRowCount);
  }
}
