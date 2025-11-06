
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../services/state.service';
import { GeminiService } from '../../services/gemini.service';
import { ArticleService } from '../../services/article.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LoaderComponent],
})
export class FilterModalComponent {
  stateService = inject(StateService);
  geminiService = inject(GeminiService);
  articleService = inject(ArticleService);

  searchText = signal('');

  async performSearch() {
    if (this.searchText().trim().length === 0) return;
    
    const results = await this.geminiService.searchForNewsArticles(this.searchText());
    this.articleService.setSearchResults(results);
    this.stateService.toggleFilterModal();
  }

  resetFeed() {
    this.articleService.loadInitialArticles();
    this.searchText.set('');
    this.stateService.toggleFilterModal();
  }
}
