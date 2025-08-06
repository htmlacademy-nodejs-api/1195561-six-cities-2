import { Container } from 'inversify';
import { Command } from './command.interface.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { COMMAND_VERSION } from '../../shared/types/index.js';

type PackageJSONConfig = {
  version: string;
} & Record<string, unknown>;

const isPackageJSONConfig = (value: unknown): value is PackageJSONConfig =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  Object.hasOwn(value, 'version');

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
    return COMMAND_VERSION;
  }

  public execute(_container: Container): void {
    try {
      const version = this.readVersion();
      console.info(version);
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
