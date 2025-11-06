
import { Injectable, signal, effect, inject } from '@angular/core';
import { PersistenceService } from './persistence.service';

const LIKED_ARTICLES_KEY = 'vizzey_liked_articles';
const BOOKMARKED_ARTICLES_KEY = 'vizzey_bookmarked_articles';
const PREFERRED_INFLUENCES_KEY = 'vizzey_preferred_influences';
const ONBOARDING_KEY = 'vizzey_onboarding_completed';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private persistenceService = inject(PersistenceService);

  likedArticleIds = signal<Set<string>>(new Set());
  bookmarkedArticleIds = signal<Set<string>>(new Set());
  preferredInfluences = signal<Set<string>>(new Set());
  onboardingCompleted = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.persistenceService.setItem(LIKED_ARTICLES_KEY, Array.from(this.likedArticleIds()));
      this.persistenceService.setItem(BOOKMARKED_ARTICLES_KEY, Array.from(this.bookmarkedArticleIds()));
      this.persistenceService.setItem(PREFERRED_INFLUENCES_KEY, Array.from(this.preferredInfluences()));
      this.persistenceService.setItem(ONBOARDING_KEY, this.onboardingCompleted());
    });
  }

  loadUser() {
    const liked = this.persistenceService.getItem<string[]>(LIKED_ARTICLES_KEY);
    const bookmarked = this.persistenceService.getItem<string[]>(BOOKMARKED_ARTICLES_KEY);
    const influences = this.persistenceService.getItem<string[]>(PREFERRED_INFLUENCES_KEY);
    const onboarding = this.persistenceService.getItem<boolean>(ONBOARDING_KEY);

    if (liked) this.likedArticleIds.set(new Set(liked));
    if (bookmarked) this.bookmarkedArticleIds.set(new Set(bookmarked));
    if (influences) this.preferredInfluences.set(new Set(influences));
    if (onboarding) this.onboardingCompleted.set(onboarding);
  }

  toggleLike(articleId: string) {
    this.likedArticleIds.update(ids => {
      const newIds = new Set(ids);
      if (newIds.has(articleId)) {
        newIds.delete(articleId);
      } else {
        newIds.add(articleId);
      }
      return newIds;
    });
  }

  toggleBookmark(articleId: string) {
    this.bookmarkedArticleIds.update(ids => {
      const newIds = new Set(ids);
      if (newIds.has(articleId)) {
        newIds.delete(articleId);
      } else {
        newIds.add(articleId);
      }
      return newIds;
    });
  }
  
  toggleInfluence(influence: string) {
    this.preferredInfluences.update(influences => {
        const newInfluences = new Set(influences);
        if (newInfluences.has(influence)) {
            newInfluences.delete(influence);
        } else {
            newInfluences.add(influence);
        }
        return newInfluences;
    });
  }
}
