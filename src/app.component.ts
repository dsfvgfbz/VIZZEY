
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from './services/state.service';
import { UserProfileService } from './services/user-profile.service';
import { DiscoveryFeedComponent } from './components/discovery-feed/discovery-feed.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { AiPanelComponent } from './components/ai-panel/ai-panel.component';
import { FilterModalComponent } from './components/filter-modal/filter-modal.component';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { ArticleService } from './services/article.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DiscoveryFeedComponent,
    OnboardingComponent,
    AiPanelComponent,
    FilterModalComponent,
    SidePanelComponent
  ],
})
export class AppComponent implements OnInit {
  stateService = inject(StateService);
  userProfileService = inject(UserProfileService);
  articleService = inject(ArticleService);

  ngOnInit() {
    this.userProfileService.loadUser();
    this.articleService.loadInitialArticles();
    if (!this.userProfileService.onboardingCompleted()) {
      this.stateService.onboardingStep.set(1);
    }
  }
}
