import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, Role } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * Converts a File object to a Base64 string.
 */
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Streams a response from Gemini based on the conversation history and new input.
 */
export const streamGeminiResponse = async (
  history: Message[],
  prompt: string,
  image: File | null,
  onChunk: (text: string) => void
): Promise<string> => {
  
  // Format history for the API if needed. 
  // For simplicity in this single-turn/multi-turn implementation, 
  // we will construct the `contents` array based on previous messages + current prompt.
  // Ideally, use ai.chats.create() for robust history management, but manual content construction 
  // gives fine-grained control for mixed modalities here.

  // We will build the contents for the current request. 
  // Note: Gemini 3 Flash supports multi-turn with history.
  // We will use a simplified approach: Send recent history + new prompt.
  
  const contents = [];

  // Add history (last 10 messages to keep context window managed efficiently for this demo)
  const recentHistory = history.slice(-10);
  for (const msg of recentHistory) {
    contents.push({
      role: msg.role === Role.USER ? 'user' : 'model',
      parts: [{ text: msg.text }] // Simplified: omitting old images from history to save tokens in this demo
    });
  }

  // Construct current user message parts
  const currentParts: any[] = [{ text: prompt }];
  if (image) {
    const imagePart = await fileToGenerativePart(image);
    currentParts.unshift(imagePart); // Image usually goes first
  }

  contents.push({
    role: 'user',
    parts: currentParts
  });

  try {
    const result = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents: contents,
      config: {
        // Optional: System instructions can be added here
        systemInstruction: "You are a helpful, concise, and intelligent AI assistant. You answer with clarity.",
      }
    });

    let fullText = '';
    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      const chunkText = c.text;
      if (chunkText) {
        fullText += chunkText;
        onChunk(chunkText);
      }
    }
    return fullText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};