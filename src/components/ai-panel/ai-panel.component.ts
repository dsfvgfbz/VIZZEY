import { Component, ChangeDetectionStrategy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../services/state.service';
import { GeminiService } from '../../services/gemini.service';
import { LoaderComponent } from '../loader/loader.component';
import { ArchitecturalProposal, AnalysisTopic } from '../../models/article.model';
import { Chat } from '@google/genai';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

@Component({
  selector: 'app-ai-panel',
  templateUrl: './ai-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LoaderComponent],
})
export class AiPanelComponent {
  stateService = inject(StateService);
  geminiService = inject(GeminiService);

  // Analyze State
  analysisPrompts = signal<string[]>([]);
  analysisResult = signal<AnalysisTopic | null>(null);

  // Innovate State
  proposal = signal<ArchitecturalProposal | null>(null);

  // Chat State
  chatSession = signal<Chat | null>(null);
  chatHistory = signal<ChatMessage[]>([]);
  chatInput = signal('');

  // Speak State
  speechSynthesis: SpeechSynthesis | null = null;
  utterance: SpeechSynthesisUtterance | null = null;
  isSpeaking = signal(false);

  // Summarize State
  summary = signal<string | null>(null);

  constructor() {
    if (typeof window !== 'undefined') {
        this.speechSynthesis = window.speechSynthesis;
    }

    // Use an effect to react to tool changes and initialize it.
    // This is the correct way to handle side effects from signal changes.
    effect(() => {
        const tool = this.activeTool();
        if (tool) {
            this.initializeTool(tool);
        }
    });
  }

  activeArticle = computed(() => this.stateService.activeArticle());
  
  // The activeTool is now a direct reference to the signal from the state service.
  // The side effect (initializing the tool) has been moved to an `effect`.
  activeTool = this.stateService.activeAiTool;

  initializeTool(tool: string) {
    const article = this.activeArticle();
    if (!article) return;
    
    switch(tool) {
        case 'analyze':
            this.analysisResult.set(null);
            this.analysisPrompts.set([]);
            this.geminiService.generateAnalysisPrompts(article).then(p => this.analysisPrompts.set(p));
            break;
        case 'create':
            this.proposal.set(null);
            break;
        case 'chat':
            this.chatHistory.set([]);
            this.chatInput.set('');
            this.chatSession.set(this.geminiService.startChat(article));
            break;
        case 'speak':
            this.stopSpeech();
            break;
        case 'summarize':
            this.summary.set(null);
            this.geminiService.summarizeArticle(article).then(s => this.summary.set(s));
            break;
    }
  }

  async analyze(prompt: string) {
    this.analysisResult.set(null);
    const result = await this.geminiService.analyzeTopic(prompt);
    this.analysisResult.set(result);
  }

  async innovate() {
    const article = this.activeArticle();
    if(!article) return;
    this.proposal.set(null);
    const result = await this.geminiService.generateArchitecturalProposal(article);
    this.proposal.set(result);
  }
  
  async sendChatMessage() {
    const session = this.chatSession();
    const message = this.chatInput().trim();
    if (!session || !message) return;

    this.chatHistory.update(h => [...h, { role: 'user', text: message }]);
    this.chatInput.set('');
    this.geminiService.isChatting.set(true);
    
    try {
        const stream = await session.sendMessageStream({ message });
        let modelResponse = '';
        this.chatHistory.update(h => [...h, { role: 'model', text: '...' }]);
        
        for await (const chunk of stream) {
            modelResponse += chunk.text;
            this.chatHistory.update(h => {
                const newHistory = [...h];
                newHistory[newHistory.length - 1] = { role: 'model', text: modelResponse };
                return newHistory;
            });
        }
    } catch(e) {
        this.geminiService.chatError.set("Failed to get response.");
        this.chatHistory.update(h => [...h, { role: 'model', text: 'Sorry, I encountered an error.' }]);
    } finally {
        this.geminiService.isChatting.set(false);
    }
  }

  playSpeech() {
    const article = this.activeArticle();
    if (!this.speechSynthesis || !article) return;
    if (this.speechSynthesis.paused && this.utterance) {
      this.speechSynthesis.resume();
    } else {
      this.utterance = new SpeechSynthesisUtterance(article.summary);
      this.utterance.onend = () => this.isSpeaking.set(false);
      this.speechSynthesis.speak(this.utterance);
    }
    this.isSpeaking.set(true);
  }

  pauseSpeech() {
    this.speechSynthesis?.pause();
    this.isSpeaking.set(false);
  }

  stopSpeech() {
    this.speechSynthesis?.cancel();
    this.isSpeaking.set(false);
  }

  searchOnGoogle() {
    const article = this.activeArticle();
    if (!article) return;
    const query = encodeURIComponent(`${article.headline} ${article.country} ${article.source}`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  }
}