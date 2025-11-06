
import { Injectable, signal } from '@angular/core';
import { GoogleGenAI, Type, GenerateContentResponse, Chat } from '@google/genai';
import { Article, ArchitecturalProposal, AnalysisTopic } from '../models/article.model';

// This is a placeholder. In a real environment, this would be managed securely.
const API_KEY = process.env.API_KEY;

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private ai: GoogleGenAI | null = null;
  
  // Search state
  isSearching = signal(false);
  searchError = signal<string | null>(null);

  // Analysis state
  isAnalyzing = signal(false);
  analysisError = signal<string | null>(null);
  
  // Innovation state
  isInnovating = signal(false);
  innovationError = signal<string | null>(null);

  // Chat state
  isChatting = signal(false);
  chatError = signal<string | null>(null);

  constructor() {
    if (API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: API_KEY });
    } else {
      console.error('API_KEY environment variable not set.');
    }
  }

  async searchForNewsArticles(query: string): Promise<Article[]> {
    if (!this.ai) return [];
    this.isSearching.set(true);
    this.searchError.set(null);

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Find recent news articles about: "${query}". For each article, provide a headline, a one-sentence summary, the source, and the country. Also provide relevant influences (e.g., Sustainability, Technology) and keywords.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      // Simple text parsing for demonstration. A JSON response would be more robust.
      // This is a simplified parser and might not be perfect.
      const text = response.text;
      const articles: Article[] = text.split('---').map((articleText, index) => {
        const lines = articleText.trim().split('\n');
        const headline = lines.find(l => l.startsWith('Headline:'))?.replace('Headline: ', '') || 'Untitled';
        const summary = lines.find(l => l.startsWith('Summary:'))?.replace('Summary: ', '') || 'No summary available.';
        const source = lines.find(l => l.startsWith('Source:'))?.replace('Source: ', '') || 'Unknown';
        const country = lines.find(l => l.startsWith('Country:'))?.replace('Country: ', '') || 'Global';
        const influences = lines.find(l => l.startsWith('Influences:'))?.replace('Influences: ', '').split(', ') || [];
        const keywords = lines.find(l => l.startsWith('Keywords:'))?.replace('Keywords: ', '').split(', ') || [];
        
        return {
          id: `search-${Date.now()}-${index}`,
          headline, summary, source, country, influences, keywords,
          images: [{ url: `https://picsum.photos/seed/${Date.now() + index}/1080/1920`, placeholder: `https://picsum.photos/seed/${Date.now() + index}/20/35` }]
        };
      }).filter(a => a.headline !== 'Untitled');

      return articles;
    } catch (error) {
      console.error('Error searching for news:', error);
      this.searchError.set('Failed to fetch news articles.');
      return [];
    } finally {
      this.isSearching.set(false);
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
