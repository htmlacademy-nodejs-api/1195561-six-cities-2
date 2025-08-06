import { Container } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger, PinoLogger } from '../logger/index.js';
import { Config, RestConfig, RestSchema } from '../config/index.js';
import {
  DatabaseClient,
  MongoDatabaseClient,
} from '../database-client/index.js';
import { UserService } from '../../models/user/user-service.interface.js';
import { DefaultUserService } from '../../models/user/default-user.service.js';
import { UserModel } from '../../models/user/user.model.js';
import { OfferService } from '../../models/offer/offer-service.interface.js';
import { DefaultOfferService } from '../../models/offer/default-offer.service.js';
import { OfferModel } from '../../models/offer/offer.mode.js';

export function createContainer(): Container {
  const container = new Container();

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

  return container;
}
