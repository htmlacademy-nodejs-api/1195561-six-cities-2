import { Container } from 'inversify';
import { Command } from './command.interface.js';
import { COMMAND_HELP } from '../../shared/types/index.js';

export class HelpCommand implements Command {
  public getName(): string {
    return COMMAND_HELP;
  }

  public async execute(_container: Container): Promise<void> {
    console.info(`
        Программа для подготовки данных для REST API сервера.
        Пример:
            cli.js --<command> [--arguments]
        Команды:
            --version:                   # выводит номер версии
            --help:                      # печатает этот текст
            --import <filename> <login> <password> <host> <dbname> [salt]: # импортирует данные из TSV в MongoDB
            --generate <n> <path> <url>  # генерирует произвольное количество тестовых данных
        
        Примеры использования:
            --import ./data.tsv admin password localhost six-cities abc123
            --import ./test-data.tsv user pass 127.0.0.1 mydb salt123
    `);
  }
}
