export interface SettingsFormData {
  username: string;
  email: string;
  notifyDigest: 'daily' | 'weekly' | 'never';
  marketingOptIn: boolean;
}
