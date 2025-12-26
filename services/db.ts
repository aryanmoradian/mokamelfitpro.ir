import { User, SystemLog } from '../types';

const DB_KEYS = {
  USERS: 'saska_db_users_v1',
  LOGS: 'saska_db_logs_v1',
  SESSION: 'saska_db_session_v1'
};

/**
 * Database Adapter
 * Currently implements LocalStorage for Client-Side persistence.
 * Ready to be swapped with API calls (fetch) when Backend is connected.
 */
class LocalStorageAdapter {
    async getUsers(): Promise<User[]> {
        const data = localStorage.getItem(DB_KEYS.USERS);
        return data ? JSON.parse(data) : [];
    }

    async saveUsers(users: User[]): Promise<void> {
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    }

    async getLogs(): Promise<SystemLog[]> {
        const data = localStorage.getItem(DB_KEYS.LOGS);
        return data ? JSON.parse(data) : [];
    }

    async saveLogs(logs: SystemLog[]): Promise<void> {
        localStorage.setItem(DB_KEYS.LOGS, JSON.stringify(logs));
    }
}

const adapter = new LocalStorageAdapter();

export const db = {
  users: {
    async findAll(): Promise<User[]> {
      return await adapter.getUsers();
    },

    async findById(id: string): Promise<User | null> {
      const users = await adapter.getUsers();
      return users.find(u => u.id === id) || null;
    },

    async findByEmail(email: string): Promise<User | null> {
      const users = await adapter.getUsers();
      return users.find(u => u.email === email) || null;
    },

    async create(user: User & { password?: string }): Promise<User> {
      const users = await adapter.getUsers();
      users.push(user);
      await adapter.saveUsers(users);
      return user;
    },

    async update(userId: string, updates: Partial<User>): Promise<User> {
      const users = await adapter.getUsers();
      const index = users.findIndex(u => u.id === userId);
      if (index === -1) throw new Error('User not found in DB');
      
      const updatedUser = { ...users[index], ...updates };
      users[index] = updatedUser;
      await adapter.saveUsers(users);
      
      // Update session if it matches (Client-side specific)
      const session = db.session.get();
      if (session && session.id === userId) {
        db.session.set(updatedUser);
      }
      
      return updatedUser;
    },

    async delete(userId: string): Promise<void> {
      const users = await adapter.getUsers();
      const filtered = users.filter(u => u.id !== userId);
      await adapter.saveUsers(filtered);
    }
  },

  logs: {
    async findAll(): Promise<SystemLog[]> {
      return await adapter.getLogs();
    },

    async create(type: SystemLog['type'], userId?: string, details?: string): Promise<void> {
      const logs = await adapter.getLogs();
      const newLog: SystemLog = {
        id: crypto.randomUUID(),
        type,
        userId,
        details,
        timestamp: new Date().toISOString()
      };
      logs.unshift(newLog); // Newest first
      
      // Limit local storage size
      const trimmedLogs = logs.slice(0, 1000);
      await adapter.saveLogs(trimmedLogs);
    }
  },

  session: {
    get(): User | null {
      const data = localStorage.getItem(DB_KEYS.SESSION);
      return data ? JSON.parse(data) : null;
    },
    set(user: User): void {
      localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(user));
    },
    clear(): void {
      localStorage.removeItem(DB_KEYS.SESSION);
    }
  },

  // Export for Admin backup functionality
  backup: {
    async createBackup(): Promise<string> {
      const users = await adapter.getUsers();
      const logs = await adapter.getLogs();
      return JSON.stringify({ users, logs, timestamp: new Date() });
    }
  }
};