import chalk from 'chalk';
import { Command } from './command.interface.js';
import { TsvFileReader } from '../../shared/tsv-file-reader.js';

export class ImportCommand implements Command {
  private readonly defaultFileName = './mocks/data.tsv';

  public getName(): string {
    return '--import';
  }

  public execute(...args: string[]): void {
    const [filename] = args;

    const fileReader = new TsvFileReader(filename || this.defaultFileName);

    try {
      fileReader.read();

      console.log(chalk.green(JSON.stringify(fileReader.toArray(), null, 2)));
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(chalk.red(`Can't import data from file: ${filename}`));
      console.error(chalk.red(`Details: ${err.message}`));
    }
  }
}
