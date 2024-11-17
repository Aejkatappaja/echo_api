import type { Request, Response } from 'express';

import type { IUserModel, UserSchemaType } from '@/database/schema';
import { User } from '@/database/schema';
import { createError } from '@/middleware';

import { userService } from './user.services';

class UserController {
  private userModel: IUserModel;

  constructor(userModel: IUserModel) {
    this.userModel = userModel;
    // this context is lost if not specified for `read` method
    this.read = this.read.bind(this);
  }

  public async read(_req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userModel.getUsers();
      console.log(users);
      res.status(200).send(users);
    } catch (e: unknown) {
      console.error(e);
      res.status(500).json({ error: 'Users listing process failed!' });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const updatedUser = await this.userModel.updateUser(id, req.body);
      console.log(updatedUser);
      res.status(200).send(updatedUser);
    } catch (e: unknown) {
      console.error(e);
      res.status(500).json({ error: 'User updating process failed!' });
    }
  }

  public async delete(req: Request<{ id: string }>, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const deleteUser = await this.userModel.deleteUser(id);
      console.log(deleteUser);
      res.status(200).send(deleteUser);
    } catch (e: unknown) {
      console.error(e);
      res.status(500).json({ error: 'Account deletion process failed!' });
    }
  }

  public async create(req: Request<object, object, UserSchemaType>, res: Response): Promise<void> {
    try {
      const newUser = await userService.create(req.body);
      console.log(newUser);
      res.status(201).json(newUser);
    } catch (err: unknown) {
      // if (e instanceof mongoose.mongo.MongoError) res.status(401).json(e.errmsg);
      console.error(err);
      res.status(400).send(createError(err));
    }
  }

  public async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      await userService.forgotPassword(req.body.email);
      res.status(200).send('Password reset email sent');
    } catch (err: unknown) {
      res.status(400).send(createError(err));
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<void> {
    const { token } = req.params;
    const { password } = req.body;
    try {
      await userService.resetPassword({ token, password });
      res.status(200).send('Password successfully reset');
    } catch (err: unknown) {
      res.status(400).send(createError(err));
    }
  }
}

export const userController = new UserController(User);
