
import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  template: `
    <div class="flex justify-center items-center" [class]="sizeClass()">
      <svg class="animate-spin" [class]="sizeClass()" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.99988V5.99988" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 18V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5.63605 5.63623L7.75737 7.75755" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.2426 16.2427L18.364 18.364" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 12H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5.63605 18.364L7.75737 16.2427" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.2426 7.75755L18.364 5.63623" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
    size = input<'sm' | 'md' | 'lg'>('md');
    
    sizeClass() {
        switch (this.size()) {
            case 'sm': return 'h-5 w-5';
            case 'md': return 'h-8 w-8';
            case 'lg': return 'h-12 w-12';
        }
    }
}
