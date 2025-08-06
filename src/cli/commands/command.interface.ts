import { Container } from 'inversify';

export interface Command {
  getName(): string;
  execute(container: Container, ...args: string[]): void;
}
