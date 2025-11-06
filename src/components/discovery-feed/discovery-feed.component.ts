import { Component, ChangeDetectionStrategy, inject, ElementRef, ViewChild, AfterViewInit, OnDestroy, effect, Injector } from '@angular/core';
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
  private injector = inject(Injector);

  @ViewChild('feedContainer') feedContainer!: ElementRef<HTMLDivElement>;
  private intersectionObserver?: IntersectionObserver;
  private articleIntersectionObserver?: IntersectionObserver;
  private lastObservedArticleElement: Element | null = null;

  ngAfterViewInit() {
    this.setupInfiniteScrollObserver();
    this.setupActiveArticleObserver();

    // This effect replaces the (scroll) listener with a reactive approach.
    // It runs whenever the list of articles changes and updates the
    // IntersectionObserver to watch the new last element.
    effect(() => {
      // Create a dependency on the articles signal.
      this.articleService.articles();
      
      // The effect runs after the DOM is updated, so we can safely query it.
      this.observeLastArticle();
    }, { injector: this.injector }); // Pass the injector to run outside constructor context
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
    if (!this.feedContainer?.nativeElement) {
      return;
    }

    const articles = this.feedContainer.nativeElement.querySelectorAll('section');
    if (articles.length > 0) {
      const lastArticle = articles[articles.length - 1];

      // Unobserve the previous last element to improve performance.
      if (this.lastObservedArticleElement) {
        this.intersectionObserver?.unobserve(this.lastObservedArticleElement);
      }

      if (lastArticle) {
        this.intersectionObserver?.observe(lastArticle);
        this.lastObservedArticleElement = lastArticle;
      }
    }
  }

  trackById(index: number, article: Article): string {
    return article.id;
  }
  
  toggleLike(event: MouseEvent, articleId: string) {
    event.stopPropagation();
    this.userProfileService.toggleLike(articleId);
  }

  handleImageDoubleClick(event: MouseEvent, articleId: string) {
    event.stopPropagation();
    this.userProfileService.toggleLike(articleId);
  }

  toggleBookmark(event: MouseEvent, articleId: string) {
    event.stopPropagation();
    this.userProfileService.toggleBookmark(articleId);
  }

  openAiPanelForArticle(article: Article) {
    this.stateService.activeArticle.set(article);
    this.stateService.openAiPanel();
  }

  openSummaryForArticle(article: Article) {
    this.stateService.activeArticle.set(article);
    this.stateService.toggleAiPanel('summarize');
  }

  refreshPage() {
    window.location.reload();
  }

  ngOnDestroy() {
    this.intersectionObserver?.disconnect();
    this.articleIntersectionObserver?.disconnect();
  }
}