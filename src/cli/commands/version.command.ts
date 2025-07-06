import chalk from 'chalk';
import { Command } from './command.interface.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type PackageJSONConfig = {
    version: string;
} & Record<string, unknown>;

const isPackageJSONConfig = (value: unknown): value is PackageJSONConfig => (
  typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        Object.hasOwn(value, 'version')
);

export class VersionCommand implements Command {
  constructor(private readonly filePath: string = './package.json') {}

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), 'utf-8');
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!isPackageJSONConfig(importedContent)) {
      throw new Error('Invalid package.json file');
    }

    return importedContent.version;
  }

  public getName(): string {
    return '--version';
  }

  public execute(): void {
    try {
      const version = this.readVersion();
      console.info(chalk.green(version));
    } catch (error: unknown) {
      console.error(chalk.red(error));

      if (error instanceof Error) {
        console.error(chalk.red(error.message));
      }
    }
  }
}
