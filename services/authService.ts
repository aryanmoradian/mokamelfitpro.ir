import { User, PlanResult } from '../types';
import { db } from './db';

/**
 * Authentication Service Module
 * Handles User Login, Registration, and Session Management.
 */
export const authService = {
  
  async register(email: string, password: string, name: string): Promise<User> {
    // Check if user exists
    const existingUser = await db.users.findByEmail(email);
    if (existingUser) {
      throw new Error('این ایمیل قبلاً ثبت شده است.');
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      joinedAt: new Date().toISOString(),
      history: [],
      role: 'user'
    };

    // Save to DB
    // In a real backend, password would be hashed here
    const savedUser = await db.users.create({ ...newUser, password } as any);
    
    // Create Session
    db.session.set(savedUser);
    
    // Log
    await db.logs.create('REGISTER', newUser.id, `User ${name} registered`);
    
    return savedUser;
  },

  async login(email: string, password: string): Promise<User> {
    // Admin Backdoor (Specific Credentials)
    if (email === 'arianmoradianofficial@gmail.com' && password === 'Birth2556') {
        const adminUser: User = {
            id: 'admin-master-saska',
            email: 'arianmoradianofficial@gmail.com',
            name: 'مدیر ارشد سیستم',
            joinedAt: new Date().toISOString(),
            history: [],
            role: 'admin'
        };
        db.session.set(adminUser);
        await db.logs.create('LOGIN', 'admin-master-saska', 'Admin accessed Command Center');
        return adminUser;
    }
    
    const user = await db.users.findByEmail(email);
    
    // Verify Password (Simple check for demo)
    if (!user || (user as any).password !== password) {
      throw new Error('ایمیل یا رمز عبور اشتباه است.');
    }

    const { password: _, ...safeUser } = user as any;
    db.session.set(safeUser);
    await db.logs.create('LOGIN', safeUser.id, `User ${safeUser.name} logged in`);
    
    return safeUser;
  },

  async logout(): Promise<void> {
    db.session.clear();
  },

  async deleteAccount(userId: string): Promise<void> {
    await db.users.delete(userId);
    db.session.clear();
    await db.logs.create('ADMIN_ACTION', 'SYSTEM', `Account ${userId} deleted`);
  },

  getCurrentUser(): User | null {
    return db.session.get();
  },

  async saveResultToHistory(userId: string, result: PlanResult): Promise<User> {
    const user = await db.users.findById(userId);
    if (!user) throw new Error('User not found');

    const resultWithDate = { ...result, date: new Date().toISOString() };
    const updatedHistory = [resultWithDate, ...user.history]; // Prepend
    
    const updatedUser = await db.users.update(userId, { history: updatedHistory });
    await db.logs.create('TEST_COMPLETE', userId, `BodyCode: ${result.bodyCode}`);
    
    return updatedUser;
  },

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await db.users.update(userId, { password: newPassword } as any);
    await db.logs.create('ADMIN_ACTION', userId, `User changed their password`);
  }
};