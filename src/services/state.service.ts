
import { Injectable, signal } from '@angular/core';
import { Article } from '../models/article.model';

export type AiTool = 'analyze' | 'create' | 'chat' | 'speak' | null;
export type SidePanelTab = 'feed' | 'daily' | 'settings' | null;

@Injectable({ providedIn: 'root' })
export class StateService {
  // Main Feed State
  activeArticle = signal<Article | null>(null);

  // Onboarding State
  onboardingStep = signal<number>(0); // 0 = off, 1, 2, 3... for steps

  // AI Panel State
  isAiPanelOpen = signal(false);
  activeAiTool = signal<AiTool>(null);

  // Filter Modal State
  isFilterModalOpen = signal(false);

  // Side Panel State
  isSidePanelOpen = signal(false);
  activeSidePanelTab = signal<SidePanelTab>(null);

  toggleAiPanel(tool: AiTool) {
    if (this.isAiPanelOpen() && this.activeAiTool() === tool) {
      this.isAiPanelOpen.set(false);
      this.activeAiTool.set(null);
    } else {
      this.activeAiTool.set(tool);
      this.isAiPanelOpen.set(true);
      this.isSidePanelOpen.set(false);
      this.isFilterModalOpen.set(false);
    }
  }

  toggleSidePanel(tab: SidePanelTab) {
    if (this.isSidePanelOpen() && this.activeSidePanelTab() === tab) {
      this.isSidePanelOpen.set(false);
      this.activeSidePanelTab.set(null);
    } else {
      this.activeSidePanelTab.set(tab);
      this.isSidePanelOpen.set(true);
      this.isAiPanelOpen.set(false);
      this.isFilterModalOpen.set(false);
    }
  }

  toggleFilterModal() {
    this.isFilterModalOpen.update(isOpen => !isOpen);
    if(this.isFilterModalOpen()){
      this.isAiPanelOpen.set(false);
      this.isSidePanelOpen.set(false);
    }
  }

  closeAll() {
    this.isAiPanelOpen.set(false);
    this.isFilterModalOpen.set(false);
    this.isSidePanelOpen.set(false);
    this.activeAiTool.set(null);
    this.activeSidePanelTab.set(null);
  }
}
