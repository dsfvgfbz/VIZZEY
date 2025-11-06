

import { Injectable, signal, inject } from '@angular/core';
import { PersistenceService } from './persistence.service';
import { ArticleService } from './article.service';
import { GeminiService } from './gemini.service';
import { Article } from '../models/article.model';

interface DailyVizzey {
  title: string;
  articles: Article[];
  date: string; // YYYY-MM-DD
}

const DAILY_VIZZEY_KEY = 'vizzey_daily';

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

@Injectable({ providedIn: 'root' })
export class DailyVizzeyService {
  private persistenceService = inject(PersistenceService);
  private articleService = inject(ArticleService);
  private geminiService = inject(GeminiService);

  dailyVizzey = signal<DailyVizzey | null>(null);
  isLoading = signal(false);

  async generateDailyVizzey(): Promise<void> {
    this.isLoading.set(true);
    const today = getTodayDateString();
    const cachedData = this.persistenceService.getItem<DailyVizzey>(DAILY_VIZZEY_KEY);

    if (cachedData && cachedData.date === today) {
      this.dailyVizzey.set(cachedData);
      this.isLoading.set(false);
      return;
    }

    // Generate a new one
    try {
        const allArticles = this.articleService.allLocalArticles();
        const personalizedFeed = this.articleService.personalizeFeed(allArticles);
        const curatedArticles = personalizedFeed.slice(0, 4);

        if (curatedArticles.length < 4) {
             this.dailyVizzey.set({ title: "Today's Top Picks", articles: curatedArticles, date: today});
             this.isLoading.set(false);
             return;
        }

        const articleHeadlines = curatedArticles.map(a => a.headline).join(', ');
        
        const title = await this.geminiService.generateCollectionTitle(articleHeadlines);

        const newVizzey: DailyVizzey = { title: title || "Today's Curated Feed", articles: curatedArticles, date: today };
        this.dailyVizzey.set(newVizzey);
        this.persistenceService.setItem(DAILY_VIZZEY_KEY, newVizzey);
    } catch (e) {
        console.error("Failed to generate Daily Vizzey", e);
        // Fallback
        const allArticles = this.articleService.allLocalArticles();
        const curatedArticles = allArticles.slice(0, 4);
        this.dailyVizzey.set({ title: "Editor's Picks", articles: curatedArticles, date: today });
    } finally {
        this.isLoading.set(false);
    }
  }
}