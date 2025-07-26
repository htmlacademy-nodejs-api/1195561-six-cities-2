import { Command } from './command.interface.js';
import { TsvFileReader } from '../../shared/tsv-file-reader.js';
import { createOffer, getErrorMessage } from '../../shared/helpers/index.js';
import { COMMAND_IMPORT, ERROR_CANT_IMPORT } from '../../shared/types/index.js';

export class ImportCommand implements Command {
  public getName(): string {
    return COMMAND_IMPORT;
  }

  private onImportedLine(line: string) {
    const offer = createOffer(line);

    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
  }

  public async execute(...args: string[]): Promise<void> {
    const [filename] = args;

    const fileReader = new TsvFileReader(filename);

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`${ERROR_CANT_IMPORT} ${filename}`);

      console.error(getErrorMessage(error));
    }
  }
}
