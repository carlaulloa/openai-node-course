export interface Message {
  text: string;
  isGpt: boolean;
  audioUrl?: string;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  };
  imageInfo?: {
    url: string;
    alt: string;
  }
}