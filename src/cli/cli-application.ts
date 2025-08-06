import { Container } from 'inversify';
import { Command } from './commands/command.interface.js';
import { CommandParser } from './command-parser.js';
import { HelpCommand } from './commands/help.command.js';
import { createContainer } from '../shared/libs/container/container.config.js';

type CommanCollection = Record<string, Command>;

const helpCommand = new HelpCommand();

export class CLIApplication {
  private commands: CommanCollection = {};
  private container: Container;

  constructor(private readonly defaultCommand: string = '--help') {
    this.container = createContainer();
  }

  public registrCommands(commandsList: Command[]): void {
    commandsList.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Command ${command.getName()} is already registered`);
      }

      this.commands[command.getName()] = command;
    });
  }

  public getCommand(commandName: string): Command {
    const command = this.commands[commandName];

    return command ?? undefined;
  }

  public getDefaultCommand(): Command {
    if (!Object.hasOwn(this.commands, this.defaultCommand)) {
      throw new Error(`Command ${this.defaultCommand} is not registered`);
    }

    return this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command: Command = this.getCommand(commandName);

    if (!command) {
      helpCommand.execute(this.container);

      return;
    }

    const commandArgs = parsedCommand[commandName];

    command.execute(this.container, ...commandArgs);
  }
}
