import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { Logger, PinoLogger } from './shared/libs/logger/index.js';
import { Config, RestConfig, RestSchema } from './shared/libs/config/index.js';
import {
  DatabaseClient,
  MongoDatabaseClient,
} from './shared/libs/database-client/index.js';
import { UserService } from './shared/models/user/user-service.interface.js';
import { DefaultUserService } from './shared/models/user/default-user.service.js';
import { UserModel } from './shared/models/user/user.model.js';
import { OfferService } from './shared/models/offer/offer-service.interface.js';
import { DefaultOfferService } from './shared/models/offer/default-offer.service.js';
import { OfferModel } from './shared/models/offer/offer.mode.js';

async function bootstrap() {
  const container = new Container();

  container
    .bind<RestApplication>(Component.RestApplication)
    .to(RestApplication)
    .inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container
    .bind<Config<RestSchema>>(Component.Config)
    .to(RestConfig)
    .inSingletonScope();
  container
    .bind<DatabaseClient>(Component.DatabaseClient)
    .to(MongoDatabaseClient)
    .inSingletonScope();

  container
    .bind<typeof UserModel>(Component.UserModel)
    .toConstantValue(UserModel);
  container
    .bind<UserService>(Component.UserService)
    .to(DefaultUserService)
    .inSingletonScope();

  container
    .bind<typeof OfferModel>(Component.OfferModel)
    .toConstantValue(OfferModel);
  container
    .bind<OfferService>(Component.OfferService)
    .to(DefaultOfferService)
    .inSingletonScope();

  const application = container.get<RestApplication>(Component.RestApplication);

  await application.init();
}

bootstrap();
