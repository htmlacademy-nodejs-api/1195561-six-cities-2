import { UserService } from './user-service.interface.js';
import { UserModel, UserDocument } from './user.model.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserExistsError } from '../../libs/errors/user-exists.error.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: typeof UserModel
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<UserDocument> {
    const existingUser = await this.findByEmail(dto.email);

    if (existingUser) {
      throw new UserExistsError(dto.email);
    }

    const user = new UserModel({
      email: dto.email,
      avatarPath: dto.avatarPath,
      firstname: dto.firstname,
      lastname: dto.lastname,
      createdAt: new Date(),
    });

    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);

    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email });
  }

  public async findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id);
  }
}
