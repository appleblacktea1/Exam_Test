import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { mockUser } from './mockData';

// --- Types ---
export interface AuthResponse {
  user: any | null;
  error: Error | null;
}

export interface EmailTemplate {
  subject: string;
  body: string; // Supports {name} and {link} placeholders
}

// --- Default Template ---
export const DEFAULT_EMAIL_TEMPLATE: EmailTemplate = {
  subject: "歡迎加入證在玩！請驗證您的 Email",
  body: "親愛的 {name} 您好，\n\n感謝您註冊「證在玩」！請點擊下方連結以驗證您的帳號：\n\n{link}\n\n祝您學習愉快！\n證在玩團隊 敬上"
};

// --- Service Interface ---
interface IAuthService {
  signUp(email: string, password: string, name: string): Promise<AuthResponse>;
  signIn(email: string, password: string): Promise<AuthResponse>;
  signOut(): Promise<{ error: Error | null }>;
  getCurrentUser(): Promise<any | null>;
  updateEmailTemplate(template: EmailTemplate): void;
  getEmailTemplate(): EmailTemplate;
}

// --- Mock Implementation (Local Database) ---
class MockAuthService implements IAuthService {
  private usersKey = 'mock_users_db';
  private sessionKey = 'mock_session_v1';
  private templateKey = 'mock_email_template';

  constructor() {
    console.log('⚠️ Running in Mock Auth Mode (Local Storage)');
  }

  private getUsers(): any[] {
    const raw = localStorage.getItem(this.usersKey);
    return raw ? JSON.parse(raw) : [];
  }

  private saveUser(user: any) {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  // "The Bot" - Simulates sending email
  private async sendVerificationEmail(email: string, name: string) {
    const template = this.getEmailTemplate();
    const verificationLink = `http://localhost:1688/#/verify?token=${btoa(email)}`;
    
    const emailContent = template.body
      .replace('{name}', name)
      .replace('{link}', verificationLink);

    console.group('🤖 Email Bot Verification');
    console.log(`To: ${email}`);
    console.log(`Subject: ${template.subject}`);
    console.log('--- Body ---');
    console.log(emailContent);
    console.groupEnd();

    // In a real app, this would call an API. Here we alert for visibility.
    setTimeout(() => {
      alert(`[Email Bot]\n已發送驗證信給 ${email}！\n\n請查看 Console (F12) 獲取驗證連結。`);
    }, 500);
  }

  async signUp(email: string, password: string, name: string): Promise<AuthResponse> {
    await new Promise(r => setTimeout(r, 800)); // Simulate network delay
    
    const users = this.getUsers();
    if (users.find(u => u.email === email)) {
      return { user: null, error: new Error('此 Email 已被註冊') };
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password, // In real app, hash this!
      user_metadata: { name },
      role: 'student',
      email_confirmed_at: null // Not verified yet
    };

    this.saveUser(newUser);
    
    // Trigger the Bot
    await this.sendVerificationEmail(email, name);

    return { user: newUser, error: null };
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    await new Promise(r => setTimeout(r, 600));
    
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { user: null, error: new Error('帳號或密碼錯誤') };
    }

    // Mock Session
    localStorage.setItem(this.sessionKey, JSON.stringify(user));
    return { user, error: null };
  }

  async signOut(): Promise<{ error: Error | null }> {
    localStorage.removeItem(this.sessionKey);
    return { error: null };
  }

  async getCurrentUser(): Promise<any | null> {
    const raw = localStorage.getItem(this.sessionKey);
    return raw ? JSON.parse(raw) : null;
  }

  updateEmailTemplate(template: EmailTemplate): void {
    localStorage.setItem(this.templateKey, JSON.stringify(template));
  }

  getEmailTemplate(): EmailTemplate {
    const raw = localStorage.getItem(this.templateKey);
    return raw ? JSON.parse(raw) : DEFAULT_EMAIL_TEMPLATE;
  }
}

// --- Supabase Implementation ---
class SupabaseAuthService implements IAuthService {
  constructor(private client: SupabaseClient) {}

  async signUp(email: string, password: string, name: string): Promise<AuthResponse> {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    return { user: data.user, error };
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password
    });
    return { user: data.user, error };
  }

  async signOut(): Promise<{ error: Error | null }> {
    const { error } = await this.client.auth.signOut();
    return { error };
  }

  async getCurrentUser(): Promise<any | null> {
    const { data } = await this.client.auth.getUser();
    return data.user;
  }

  // Supabase templates are managed in dashboard, but we can store custom ones in DB if needed
  // For this demo, we'll fallback to local storage for the template editor feature
  updateEmailTemplate(template: EmailTemplate): void {
    localStorage.setItem('supabase_email_template_override', JSON.stringify(template));
  }

  getEmailTemplate(): EmailTemplate {
    const raw = localStorage.getItem('supabase_email_template_override');
    return raw ? JSON.parse(raw) : DEFAULT_EMAIL_TEMPLATE;
  }
}

// --- Factory ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project.supabase.co';

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const authService = isSupabaseConfigured && supabase
  ? new SupabaseAuthService(supabase)
  : new MockAuthService();
