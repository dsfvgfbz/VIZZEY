import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../services/state.service';
import { ArticleService } from '../../services/article.service';
import { LoaderComponent } from '../loader/loader.component';
import { UserProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LoaderComponent],
})
export class FilterModalComponent {
  stateService = inject(StateService);
  articleService = inject(ArticleService);
  userProfileService = inject(UserProfileService);

  countrySearchTerm = signal('');

  filteredCountries = computed(() => {
    const term = this.countrySearchTerm().toLowerCase();
    if (!term) {
      return this.articleService.availableCountries();
    }
    return this.articleService.availableCountries().filter(country =>
      country.toLowerCase().includes(term)
    );
  });

  readonly allInfluences = [
    'Sustainability', 'Technology', 'Innovation', 'Minimalism', 'Urbanism',
    'Social Impact', 'Global Culture', 'Heritage', 'Biophilic Design', 
    'Brutalism', 'Interior Design', 'Wellbeing'
  ];

  onCountrySearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.countrySearchTerm.set(input.value);
  }
}