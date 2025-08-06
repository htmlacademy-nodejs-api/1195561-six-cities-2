import { Schema, Document, model } from 'mongoose';
import { User } from '../../types/index.js';
import { createSHA256 } from '../../helpers/createSHA256.js';

export interface UserDocument extends User, Document {
  setPassword(password: string, salt: string): void;
  getPassword(): string | undefined;
}

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: true,
      select: false,
    },
    email: {
      type: String,
      required: true,
      // Todo-Omarov: найти какую-нибудь библиотеку для валидации email
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email is incorrect'],
      unique: true,
    },
    avatarPath: {
      type: String,
      required: false,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    updatedAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.setPassword = function (password: string, salt: string) {
  this.password = createSHA256(password, salt);
};

userSchema.methods.getPassword = function () {
  return this.password;
};

export const UserModel = model<UserDocument>('User', userSchema);
