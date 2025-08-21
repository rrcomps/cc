export interface LeadFormData {
  fullName: string;
  email: string;
  phone: string;
  postcode: string;
  debtAmount: number;
  debtTypes: string[];
  consentContact: boolean;
  consentPrivacy: boolean;
  honey: string; // honeypot
}

export interface LeadPayload {
  source: string;
  timestamp: string;
  mode: 'single' | 'two';
  fullName: string;
  email: string;
  phone: string;
  postcode: string;
  debtAmount: number;
  debtTypes: string[];
  consentContact: boolean;
  consentPrivacy: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  ip?: string;
  user_agent?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSlots {
  fullName: string;
  email: string;
  phone: string;
  postcode: string;
  debtBand: string;
  consentContact: boolean | null;
  consentPrivacy: boolean | null;
  preferredTime: string;
}

export interface Feature {
  icon: React.ReactNode;
  label: React.ReactNode;
}

export interface Review {
  name: string;
  area: string;
  text: string;
}

export interface FormErrors {
  fullName: string;
  email: string;
  phone: string;
  postcode: string;
}

export interface FormTouched {
  fullName: boolean;
  email: boolean;
  phone: boolean;
  postcode: boolean;
}

export type FormMode = 'single' | 'two';
export type ChatPhase = 'idle' | 'name' | 'email' | 'phone' | 'postcode' | 'debt' | 'consent1' | 'consent2' | 'callback' | 'confirm' | 'done';
