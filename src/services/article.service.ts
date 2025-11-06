import { Injectable, signal, inject, computed } from '@angular/core';
import { Article } from '../models/article.model';
import { LocalArticlesService } from './local-articles.service';
import { UserProfileService } from './user-profile.service';

const PAGE_SIZE = 5;

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private localArticlesService = inject(LocalArticlesService);
  private userProfileService = inject(UserProfileService);
  
  // Make public so DailyVizzey can access it
  allLocalArticles = signal<Article[]>([]);
  private loadedPages = signal<number>(1);
  
  // The master list of articles, potentially from a search result or the local list
  masterArticleList = signal<Article[]>([]);

  // The final, visible list of articles, personalized and paginated
  articles = computed(() => {
    const masterList = this.masterArticleList();
    const preferredCountries = this.userProfileService.preferredCountries();
    const preferredInfluences = this.userProfileService.preferredInfluences();
    
    // Filter by country
    const countryFilteredList = preferredCountries.size === 0 
        ? masterList 
        : masterList.filter(article => preferredCountries.has(article.country));

    // Filter by influence
    const influenceFilteredList = preferredInfluences.size === 0
        ? countryFilteredList
        : countryFilteredList.filter(article => 
            article.influences.some(influence => preferredInfluences.has(influence))
          );

    const personalizedList = this.personalizeFeed(influenceFilteredList);
    return personalizedList.slice(0, this.loadedPages() * PAGE_SIZE);
  });

  availableCountries = computed(() => {
    const countries = this.allLocalArticles()
      .map(a => a.country)
      .filter(c => c && c !== 'Global' && c !== 'N/A');
    return [...new Set(countries)].sort();
  });
  
  likedArticles = computed(() => {
    const likedIds = this.userProfileService.likedArticleIds();
    return this.allLocalArticles().filter(a => likedIds.has(a.id));
  });

  bookmarkedArticles = computed(() => {
    const bookmarkedIds = this.userProfileService.bookmarkedArticleIds();
    return this.allLocalArticles().filter(a => bookmarkedIds.has(a.id));
  });

  loadInitialArticles() {
    const localArticles = this.localArticlesService.getArticles();
    this.allLocalArticles.set(localArticles);
    this.masterArticleList.set(localArticles);
    this.loadedPages.set(1);
  }

  loadMoreArticles() {
    this.loadedPages.update(p => p + 1);
  }

  // Make public so DailyVizzey can access it
  personalizeFeed(articles: Article[]): Article[] {
    const likedIds = this.userProfileService.likedArticleIds();
    const preferredInfluences = this.userProfileService.preferredInfluences();

    if (likedIds.size === 0 && preferredInfluences.size === 0) {
      return articles;
    }

    const likedArticles = articles.filter(a => likedIds.has(a.id));
    const likedKeywords = new Set(likedArticles.flatMap(a => a.keywords));
    const likedSources = new Set(likedArticles.map(a => a.source));
    const likedInfluences = new Set(likedArticles.flatMap(a => a.influences));

    return [...articles].sort((a, b) => {
      return this.calculateScore(b, likedKeywords, likedSources, likedInfluences, preferredInfluences) - 
             this.calculateScore(a, likedKeywords, likedSources, likedInfluences, preferredInfluences);
    });
  }

  private calculateScore(
    article: Article, 
    likedKeywords: Set<string>, 
    likedSources: Set<string>,
    likedInfluences: Set<string>,
    preferredInfluences: Set<string>
  ): number {
    let score = 0;
    
    // Score based on explicit preferences
    for (const influence of article.influences) {
      if (preferredInfluences.has(influence)) score += 5;
    }

    // Score based on implicit preferences (likes)
    for (const keyword of article.keywords) {
      if (likedKeywords.has(keyword)) score += 2;
    }
    if (likedSources.has(article.source)) score += 1;
    for (const influence of article.influences) {
      if (likedInfluences.has(influence)) score += 3;
    }

    return score;
  }
}