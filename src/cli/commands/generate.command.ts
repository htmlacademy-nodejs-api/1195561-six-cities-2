import { Container } from 'inversify';
import { Command } from './command.interface.js';
import got from 'got';
import {
  MockData,
  DECIMAL_RADIX,
  COMMAND_GENERATE,
  ERROR_CANT_GENERATE,
  ERROR_CANT_LOAD_DATA,
} from '../../shared/types/index.js';
import { TSVOfferGenerate } from '../../shared/libs/offer-generator/tsv-offer-generate.js';
import { TSVFileWriter } from '../../shared/libs/file-written/index.js';
import { getErrorMessage } from '../../shared/helpers/index.js';
export class GenerateCommand implements Command {
  private initialData: MockData;

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();

      console.log(this.initialData);
    } catch {
      throw new Error(`${ERROR_CANT_LOAD_DATA} ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerate(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }

  public getName(): string {
    return COMMAND_GENERATE;
  }

  public async execute(
    _container: Container,
    ...parameters: string[]
  ): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, DECIMAL_RADIX);

    try {
      await this.load(url);

      await this.write(filepath, offerCount);

      console.info(`File ${filepath} was created!`);
    } catch (error: unknown) {
      console.error(ERROR_CANT_GENERATE);

      if (error instanceof Error) {
        console.error(getErrorMessage(error));
      }
    }
  }
}
