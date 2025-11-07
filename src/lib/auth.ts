import { supabase } from './supabase';

export interface AuthSession {
  adminId: string;
  email: string;
  name: string | null;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthSession> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw new Error('Invalid credentials');
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id, email, name')
      .eq('email', data.user.email)
      .maybeSingle();

    if (!adminUser) {
      await supabase.auth.signOut();
      throw new Error('Not authorized as admin');
    }

    const session: AuthSession = {
      adminId: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
    };

    return session;
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  async getSession(): Promise<AuthSession | null> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) return null;

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id, email, name')
      .eq('email', session.user.email)
      .maybeSingle();

    if (!adminUser) return null;

    return {
      adminId: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
    };
  },

  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return session !== null;
  },
};
