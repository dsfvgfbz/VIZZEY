
import { Component, ChangeDetectionStrategy, inject, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { UserProfileService } from '../../services/user-profile.service';
import { StateService } from '../../services/state.service';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-discovery-feed',
  templateUrl: './discovery-feed.component.html',
  styleUrls: ['./discovery-feed.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage],
})
export class DiscoveryFeedComponent implements AfterViewInit, OnDestroy {
  articleService = inject(ArticleService);
  userProfileService = inject(UserProfileService);
  stateService = inject(StateService);

  @ViewChild('feedContainer') feedContainer!: ElementRef<HTMLDivElement>;
  private intersectionObserver?: IntersectionObserver;
  private articleIntersectionObserver?: IntersectionObserver;
  private observedElements = new WeakMap<Element, boolean>();

  ngAfterViewInit() {
    this.setupInfiniteScrollObserver();
    this.setupActiveArticleObserver();
  }

  private setupInfiniteScrollObserver() {
    const options = {
      root: this.feedContainer.nativeElement,
      rootMargin: '0px 0px 50% 0px', // Trigger when the user is 50% from the bottom
      threshold: 0,
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.articleService.loadMoreArticles();
        }
      });
    }, options);

    // Observe the last element initially
    this.observeLastArticle();
  }

  private setupActiveArticleObserver() {
    const options = {
        root: this.feedContainer.nativeElement,
        threshold: 0.6 // at least 60% of the item is visible
    };

    this.articleIntersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const articleId = (entry.target as HTMLElement).dataset.articleId;
                if (articleId) {
                    const activeArticle = this.articleService.articles().find(a => a.id === articleId);
                    if (activeArticle) {
                        this.stateService.activeArticle.set(activeArticle);
                    }
                }
            }
        });
    }, options);

    this.observeVisibleArticles();
  }

  observeVisibleArticles() {
    setTimeout(() => {
        const articles = this.feedContainer.nativeElement.querySelectorAll('[data-article-id]');
        articles.forEach(article => this.articleIntersectionObserver?.observe(article));
    }, 0);
  }

  observeLastArticle() {
    // We must wait for the view to be updated
    setTimeout(() => {
      const articles = this.feedContainer.nativeElement.querySelectorAll('section');
      if (articles.length > 0) {
        const lastArticle = articles[articles.length - 1];
        if (lastArticle && !this.observedElements.has(lastArticle)) {
            this.intersectionObserver?.observe(lastArticle);
            this.observedElements.set(lastArticle, true);
        }
      }
    }, 100);
  }

  trackById(index: number, article: Article): string {
    return article.id;
  }
  
  toggleLike(event: MouseEvent, articleId: string) {
    event.stopPropagation();
    this.userProfileService.toggleLike(articleId);
  }

  toggleBookmark(event: MouseEvent, articleId: string) {
    event.stopPropagation();
    this.userProfileService.toggleBookmark(articleId);
  }

  ngOnDestroy() {
    this.intersectionObserver?.disconnect();
    this.articleIntersectionObserver?.disconnect();
  }
}
