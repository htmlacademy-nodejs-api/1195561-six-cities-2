import 'reflect-metadata';
import { Container } from 'inversify';
import { Command } from './command.interface.js';
import { TsvFileReader } from '../../shared/tsv-file-reader.js';
import {
  createOffer,
  getErrorMessage,
  getMongoURI,
} from '../../shared/helpers/index.js';
import {
  COMMAND_IMPORT,
  ERROR_CANT_IMPORT,
} from '../../shared/constants/commands.js';
import { UserModel } from '../../shared/models/user/user.model.js';
import { OfferModel } from '../../shared/models/offer/offer.mode.js';
import { OfferService } from '../../shared/models/offer/offer-service.interface.js';
import { DefaultOfferService } from '../../shared/models/offer/default-offer.service.js';
import {
  DatabaseClient,
  MongoDatabaseClient,
} from '../../shared/libs/database-client/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { PinoLogger } from '../../shared/libs/logger/pino.logger.js';
import { TOffer } from '../../shared/types/index.js';
import { Component } from '../../shared/types/index.js';
import {
  DEFAULT_DB_PORT,
  DEFAULT_USER_PASSWORD,
  DEFAULT_SALT,
} from './command.constant.js';

export class ImportCommand implements Command {
  private offerService: OfferService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;
  private container: Container;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.container = new Container();

    this.container
      .bind<Logger>(Component.Logger)
      .to(PinoLogger)
      .inSingletonScope();

    this.container
      .bind<DatabaseClient>(Component.DatabaseClient)
      .to(MongoDatabaseClient)
      .inSingletonScope();

    this.container
      .bind<typeof OfferModel>(Component.OfferModel)
      .toConstantValue(OfferModel);

    this.container
      .bind<OfferService>(Component.OfferService)
      .to(DefaultOfferService)
      .inSingletonScope();

    this.logger = this.container.get<Logger>(Component.Logger);
    this.databaseClient = this.container.get<DatabaseClient>(
      Component.DatabaseClient
    );
    this.offerService = this.container.get<OfferService>(
      Component.OfferService
    );
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = createOffer(line);

    await this.saveOffer(offer);

    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);

    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: TOffer) {
    let user = await UserModel.findOne({ email: offer.host.email });

    if (!user) {
      user = new UserModel({
        email: offer.host.email,
        avatarPath: offer.host.avatarPath,
        firstname: offer.host.firstname,
        lastname: offer.host.lastname,
        createdAt: new Date(),
      });

      user.setPassword(DEFAULT_USER_PASSWORD, this.salt);

      await UserModel.create(user);
      this.logger.info(`New user created: ${user.email}`);
    }

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      postDate: offer.postDate,
      city: offer.city,
      previewImage: offer.previewImage,
      images: offer.images,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      type: offer.type,
      bedrooms: offer.bedrooms,
      maxAdults: offer.maxAdults,
      price: offer.price,
      goods: offer.goods,
      host: user.id,
      commentsCount: offer.commentsCount,
      location: offer.location,
    });
  }

  public getName(): string {
    return COMMAND_IMPORT;
  }

  public async execute(...args: string[]): Promise<void> {
    if (args.length < 5) {
      console.error(
        'Usage: --import <filename> <login> <password> <host> <dbname> [salt]'
      );
      console.error(
        'Example: --import ./data.tsv admin password localhost six-cities abc123'
      );
      return;
    }

    const [filename, login, password, host, dbname, salt = DEFAULT_SALT] = args;

    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    try {
      await this.databaseClient.connect(uri);
      const fileReader = new TsvFileReader(filename);

      fileReader.on('line', this.onImportedLine);
      fileReader.on('end', this.onCompleteImport);

      await fileReader.read();
    } catch (error) {
      console.error(`${ERROR_CANT_IMPORT} ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
