import chalk from 'chalk';
import { Command } from './command.interface.js';
import { TsvFileReader } from '../../shared/tsv-file-reader.js';
import { createOffer, getErrorMessage } from '../../shared/helpers/index.js';

export class ImportCommand implements Command {
  private readonly defaultFileName = './mocks/data.tsv';

  public getName(): string {
    return '--import';
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

    const fileReader = new TsvFileReader(filename || this.defaultFileName);

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(chalk.red(`Can't import data from file: ${filename}`));

      console.error(chalk.red(getErrorMessage(error)));
    }
  }
}
