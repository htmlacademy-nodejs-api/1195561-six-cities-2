export const Component = {
  RestApplication: Symbol('RestApplication'),
  Logger: Symbol('Logger'),
  Config: Symbol('Config'),
  DatabaseClient: Symbol('DatabaseClient'),
  UserService: Symbol('UserService'),
  UserModel: Symbol('UserModel'),
  OfferModel: Symbol('OfferModel'),
  OfferService: Symbol('OfferService'),
} as const;
