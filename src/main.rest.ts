import 'reflect-metadata';
import { RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { createContainer } from './shared/libs/container/container.config.js';

async function bootstrap() {
  const container = createContainer();

  container
    .bind<RestApplication>(Component.RestApplication)
    .to(RestApplication)
    .inSingletonScope();

  const application = container.get<RestApplication>(Component.RestApplication);

  await application.init();
}

bootstrap();
