import { db } from './db';
import { User, SystemLog } from '../types';

/**
 * Admin Service Module
 * Handles system-wide statistics, user management, and logging.
 */
export const adminService = {
  
  /**
   * Log a system event (e.g., WhatsApp Clicks)
   */
  async logEvent(type: SystemLog['type'], userId?: string, details?: string) {
    await db.logs.create(type, userId, details);
  },

  /**
   * Get secure system statistics for the Admin Dashboard
   */
  async getSystemStats() {
    const users = await db.users.findAll();
    const logs = await db.logs.findAll();
    
    const totalTests = users.reduce((acc, u) => acc + (u.history?.length || 0), 0);
    const whatsappClicks = logs.filter(l => l.type === 'WHATSAPP_CLICK').length;
    
    // Calculate Conversion Rate
    const conversionRate = totalTests > 0 
      ? Math.min(100, Math.round((whatsappClicks / totalTests) * 100)) 
      : 0;

    return {
        totalUsers: users.length,
        totalTests,
        whatsappClicks,
        conversionRate,
        logs: logs.slice(0, 50) // Return recent logs
    };
  },

  /**
   * Get all users (Including passwords for Admin view)
   */
  async getAllUsers(): Promise<User[]> {
    const users = await db.users.findAll();
    // We return the raw user objects including passwords for the admin panel features
    return users;
  },

  /**
   * Reset a user's password
   */
  async resetUserPassword(userId: string, newPassword: string): Promise<void> {
    await db.users.update(userId, { password: newPassword } as any);
    await db.logs.create('ADMIN_ACTION', 'SYSTEM', `Password reset for user ${userId}`);
  }
};