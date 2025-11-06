import { Injectable, signal } from '@angular/core';
import { GoogleGenAI, Type, GenerateContentResponse, Chat } from '@google/genai';
import { Article, ArchitecturalProposal, AnalysisTopic } from '../models/article.model';

// This is a placeholder. In a real environment, this would be managed securely.
const API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private ai: GoogleGenAI | null = null;
  
  // Analysis state
  isAnalyzing = signal(false);
  analysisError = signal<string | null>(null);
  
  // Innovation state
  isInnovating = signal(false);
  innovationError = signal<string | null>(null);

  // Chat state
  isChatting = signal(false);
  chatError = signal<string | null>(null);

  // Summarize state
  isSummarizing = signal(false);
  summaryError = signal<string | null>(null);

  constructor() {
    if (API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: API_KEY });
    } else {
      console.error('API_KEY environment variable not set.');
    }
  }

  async generateAnalysisPrompts(article: Article): Promise<string[]> {
    if (!this.ai) return [];
    this.isAnalyzing.set(true);
    this.analysisError.set(null);
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Based on the article headline "${article.headline}" and summary "${article.summary}", generate 4 insightful and distinct questions to deeply analyze the topic.`,
        config: { 
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            }
          }
        },
      });
      const result = JSON.parse(response.text);
      return result.questions || [];
    } catch(e) {
        console.error('Error generating prompts:', e);
        this.analysisError.set('Could not generate analysis prompts.');
        return [];
    } finally {
        this.isAnalyzing.set(false);
    }
  }

  async analyzeTopic(question: string): Promise<AnalysisTopic> {
    if (!this.ai) return { question, answer: 'AI service not available.', sources: [] };
    this.isAnalyzing.set(true);
    this.analysisError.set(null);
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: question,
        config: {
          tools: [{ googleSearch: {} }]
        },
      });
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => chunk.web)
        .filter((web: any) => web?.uri && web?.title) || [];
      
      return { question, answer: response.text, sources };
    } catch(e) {
        console.error('Error analyzing topic:', e);
        this.analysisError.set('Failed to analyze the topic.');
        return { question, answer: 'An error occurred during analysis.', sources: [] };
    } finally {
        this.isAnalyzing.set(false);
    }
  }

  async generateArchitecturalProposal(article: Article): Promise<ArchitecturalProposal | null> {
    if (!this.ai) return null;
    this.isInnovating.set(true);
    this.innovationError.set(null);
    try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Inspired by the article with headline "${article.headline}", generate a conceptual architectural proposal.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
                        materials: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });
        return JSON.parse(response.text) as ArchitecturalProposal;
    } catch (e) {
        console.error('Error generating proposal:', e);
        this.innovationError.set('Failed to generate proposal.');
        return null;
    } finally {
        this.isInnovating.set(false);
    }
  }

  async summarizeArticle(article: Article): Promise<string> {
    if (!this.ai) return 'AI service not available.';
    this.isSummarizing.set(true);
    this.summaryError.set(null);
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Based on the article headline "${article.headline}" and summary "${article.summary}", provide a concise, one-paragraph summary.`,
      });
      return response.text;
    } catch (e) {
      console.error('Error summarizing article:', e);
      this.summaryError.set('Failed to generate summary.');
      return 'An error occurred while generating the summary.';
    } finally {
      this.isSummarizing.set(false);
    }
  }

  async generateCollectionTitle(headlines: string): Promise<string | null> {
    if (!this.ai) return null;
    try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based on these article headlines: ${headlines}. Create a catchy, thematic title for this collection. The title should be short and evocative.`,
             config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { title: { type: Type.STRING } }
                }
            }
        });
        const result = JSON.parse(response.text);
        return result.title || null;
    } catch(e) {
        console.error("Failed to generate title", e);
        return null;
    }
  }

  startChat(article: Article): Chat | null {
    if (!this.ai) return null;
    return this.ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are an expert chatbot specializing in architecture, design, and technology. Your current context is an article titled "${article.headline}". Answer questions related to this topic.`,
        }
    });
  }
}