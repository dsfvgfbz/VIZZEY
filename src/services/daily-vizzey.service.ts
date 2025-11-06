
import { Injectable, signal, inject } from '@angular/core';
import { PersistenceService } from './persistence.service';
import { ArticleService } from './article.service';
import { GeminiService } from './gemini.service';
import { Article } from '../models/article.model';
// Fix: Import 'Type' from '@google/genai' to use in the responseSchema.
import { Type } from '@google/genai';

interface DailyVizzey {
  title: string;
  articles: Article[];
  date: string; // YYYY-MM-DD
}

const DAILY_VIZZEY_KEY = 'vizzey_daily';

@Injectable({ providedIn: 'root' })
export class DailyVizzeyService {
  private persistenceService = inject(PersistenceService);
  private articleService = inject(ArticleService);
  private geminiService = inject(GeminiService);

  dailyVizzey = signal<DailyVizzey | null>(null);
  isLoading = signal(false);

  private getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  async generateDailyVizzey(): Promise<void> {
    this.isLoading.set(true);
    const today = this.getTodayDateString();
    const cachedData = this.persistenceService.getItem<DailyVizzey>(DAILY_VIZZEY_KEY);

    if (cachedData && cachedData.date === today) {
      this.dailyVizzey.set(cachedData);
      this.isLoading.set(false);
      return;
    }

    // Generate a new one
    try {
        const allArticles = this.articleService['allLocalArticles']();
        const personalizedFeed = this.articleService['personalizeFeed'](allArticles);
        const curatedArticles = personalizedFeed.slice(0, 4);

        if (curatedArticles.length < 4) {
             this.dailyVizzey.set({ title: "Today's Top Picks", articles: curatedArticles, date: today});
             this.isLoading.set(false);
             return;
        }

        const articleHeadlines = curatedArticles.map(a => a.headline).join(', ');

        if (!this.geminiService['ai']) {
            const fallbackTitle = "Today's Curated Feed";
            const newVizzey: DailyVizzey = { title: fallbackTitle, articles: curatedArticles, date: today };
            this.dailyVizzey.set(newVizzey);
            this.persistenceService.setItem(DAILY_VIZZEY_KEY, newVizzey);
            return;
        }
        
        const response = await this.geminiService['ai'].models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based on these article headlines: ${articleHeadlines}. Create a catchy, thematic title for this collection. The title should be short and evocative.`,
             config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { title: { type: Type.STRING } }
                }
            }
        });

        const result = JSON.parse(response.text);
        const title = result.title || "Today's Curated Feed";

        const newVizzey: DailyVizzey = { title, articles: curatedArticles, date: today };
        this.dailyVizzey.set(newVizzey);
        this.persistenceService.setItem(DAILY_VIZZEY_KEY, newVizzey);
    } catch (e) {
        console.error("Failed to generate Daily Vizzey", e);
        // Fallback
        const allArticles = this.articleService['allLocalArticles']();
        const curatedArticles = allArticles.slice(0, 4);
        this.dailyVizzey.set({ title: "Editor's Picks", articles: curatedArticles, date: today });
    } finally {
        this.isLoading.set(false);
    }
  }
}
