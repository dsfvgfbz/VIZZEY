
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../services/state.service';
import { UserProfileService } from '../../services/user-profile.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class OnboardingComponent {
  stateService = inject(StateService);
  userProfileService = inject(UserProfileService);

  nextStep() {
    this.stateService.onboardingStep.update(step => step + 1);
  }

  finishOnboarding() {
    this.stateService.onboardingStep.set(0);
    this.userProfileService.onboardingCompleted.set(true);
  }
}
