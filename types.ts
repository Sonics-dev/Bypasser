export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  imageUrl?: string;
  isStreaming?: boolean;
  timestamp: number;
}

export interface SendMessageParams {
  prompt: string;
  image?: File | null;
}