import { BaseFactory } from './base';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export class UserFactory extends BaseFactory<User> {
  protected generate(): User {
    return {
      id: crypto.randomUUID(),
      email: `user-${Math.random().toString(36).slice(2)}@example.com`,
      name: `User ${Math.random().toString(36).slice(2)}`,
      role: 'user',
      createdAt: new Date(),
    };
  }
}

export const createUserFactory = () => new UserFactory(); 