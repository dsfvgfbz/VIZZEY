
import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { StateService } from '../../services/state.service';
import { ArticleService } from '../../services/article.service';
import { DailyVizzeyService } from '../../services/daily-vizzey.service';
import { UserProfileService } from '../../services/user-profile.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-side-panel',
  templateUrl: './side-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgOptimizedImage, LoaderComponent],
})
export class SidePanelComponent {
  stateService = inject(StateService);
  articleService = inject(ArticleService);
  dailyVizzeyService = inject(DailyVizzeyService);
  userProfileService = inject(UserProfileService);

  activeSavedTab = 'liked'; // 'liked' or 'bookmarked'
  
  readonly allInfluences = [
    'Sustainability', 'Technology', 'Innovation', 'Minimalism', 'Urbanism',
    'Social Impact', 'Global Culture', 'Heritage', 'Biophilic Design', 
    'Brutalism', 'Interior Design', 'Wellbeing'
  ];

  constructor() {
    this.dailyVizzeyService.generateDailyVizzey();
  }
}
