
import { Injectable } from '@angular/core';
import { Article } from '../models/article.model';

@Injectable({ providedIn: 'root' })
export class LocalArticlesService {
  getArticles(): Article[] {
    return [
      {
        id: '1',
        headline: 'Biophilic Skyscraper Redefines Urban Living in Singapore',
        summary: 'A new residential tower in Singapore integrates lush vertical gardens and natural materials, aiming to reconnect city dwellers with nature.',
        source: 'ArchDaily', country: 'Singapore',
        images: [
          { url: 'https://picsum.photos/id/1018/1080/1920', placeholder: 'https://picsum.photos/id/1018/20/35' },
          { url: 'https://picsum.photos/id/1025/1080/1920', placeholder: 'https://picsum.photos/id/1025/20/35' },
        ],
        influences: ['Sustainability', 'Biophilic Design'],
        keywords: ['green architecture', 'urban jungle', 'sustainable living']
      },
      // ... more articles
      {
        id: '2',
        headline: 'Parametric Design Transforms a Museum Façade in Dubai',
        summary: 'Using computational algorithms, architects have created a stunning, wave-like façade for Dubai\'s new Museum of the Future.',
        source: 'Dezeen', country: 'UAE',
        images: [{ url: 'https://picsum.photos/id/103/1080/1920', placeholder: 'https://picsum.photos/id/103/20/35' }],
        influences: ['Technology', 'Innovation'],
        keywords: ['parametricism', 'computational design', 'futurism']
      },
      {
        id: '3',
        headline: 'Minimalist Japanese "Micro-Home" Maximizes Small Space',
        summary: 'In Tokyo, a tiny house on a challenging plot of land showcases clever storage solutions and minimalist aesthetics to create a comfortable living space.',
        source: 'Design Boom', country: 'Japan',
        images: [{ url: 'https://picsum.photos/id/1043/1080/1920', placeholder: 'https://picsum.photos/id/1043/20/35' }],
        influences: ['Minimalism', 'Urbanism'],
        keywords: ['tiny house', 'small-space living', 'Japanese design']
      },
      {
        id: '4',
        headline: '3D-Printed Community Rises in Rural Mexico',
        summary: 'A partnership between non-profits has resulted in the world\'s first 3D-printed neighborhood, providing resilient and affordable housing.',
        source: 'Reuters', country: 'Mexico',
        images: [
            { url: 'https://picsum.photos/id/1047/1080/1920', placeholder: 'https://picsum.photos/id/1047/20/35' },
            { url: 'https://picsum.photos/id/1048/1080/1920', placeholder: 'https://picsum.photos/id/1048/20/35' }
        ],
        influences: ['Technology', 'Social Impact'],
        keywords: ['3d printing', 'affordable housing', 'construction tech']
      },
      {
        id: '5',
        headline: 'Copenhagen\'s New Power Plant Doubles as a Ski Slope',
        summary: 'CopenHill, a waste-to-energy plant, features a public ski slope on its roof, blending industrial infrastructure with public recreation.',
        source: 'The Guardian', country: 'Denmark',
        images: [{ url: 'https://picsum.photos/id/1060/1080/1920', placeholder: 'https://picsum.photos/id/1060/20/35' }],
        influences: ['Sustainability', 'Urbanism'],
        keywords: ['public space', 'renewable energy', 'innovative infrastructure']
      },
      {
        id: '6',
        headline: 'The Rise of "Digital Nomad" Visas and Their Impact on Global Cities',
        summary: 'Countries are increasingly offering special visas for remote workers, transforming tourism and housing markets in cities like Lisbon and Bali.',
        source: 'Wired', country: 'Global',
        images: [{ url: 'https://picsum.photos/id/1062/1080/1920', placeholder: 'https://picsum.photos/id/1062/20/35' }],
        influences: ['Global Culture', 'Technology'],
        keywords: ['remote work', 'digital nomad', 'globalization']
      },
      {
        id: '7',
        headline: 'Generative AI Creates "Impossible" Architectural Concepts',
        summary: 'Artists and designers are using text-to-image AI models to visualize fantastical buildings and cities that defy the laws of physics.',
        source: 'Creative Bloq', country: 'N/A',
        images: [{ url: 'https://picsum.photos/id/1074/1080/1920', placeholder: 'https://picsum.photos/id/1074/20/35' }],
        influences: ['Innovation', 'Technology'],
        keywords: ['generative art', 'ai in design', 'conceptual architecture']
      },
      {
        id: '8',
        headline: 'Revitalizing Brutalism: London\'s Barbican Centre Gets a Facelift',
        summary: 'A sensitive restoration project aims to preserve the iconic Brutalist architecture of the Barbican while updating its facilities for the 21st century.',
        source: 'Wallpaper*', country: 'UK',
        images: [{ url: 'https://picsum.photos/id/1084/1080/1920', placeholder: 'https://picsum.photos/id/1084/20/35' }],
        influences: ['Heritage', 'Brutalism'],
        keywords: ['architectural preservation', 'brutalist architecture', 'concrete']
      },
      {
        id: '9',
        headline: 'Seoul\'s "Smart City" Infrastructure Aims for Zero Emissions',
        summary: 'The city of Seoul is investing heavily in IoT sensors, AI-powered traffic management, and renewable energy to create a sustainable urban future.',
        source: 'Bloomberg', country: 'South Korea',
        images: [{ url: 'https://picsum.photos/id/111/1080/1920', placeholder: 'https://picsum.photos/id/111/20/35' }],
        influences: ['Technology', 'Sustainability'],
        keywords: ['smart city', 'iot', 'urban technology']
      },
      {
        id: '10',
        headline: 'The Psychology of Color in Interior Design',
        summary: 'Explore how different colors impact mood and perception in living spaces, with expert tips on creating specific atmospheres.',
        source: 'Architectural Digest', country: 'N/A',
        images: [{ url: 'https://picsum.photos/id/116/1080/1920', placeholder: 'https://picsum.photos/id/116/20/35' }],
        influences: ['Interior Design', 'Wellbeing'],
        keywords: ['color theory', 'psychology', 'home decor']
      },
       {
        id: '11',
        headline: 'Floating Architecture: A Solution for Rising Sea Levels?',
        summary: 'Designers in the Netherlands are pioneering amphibious and floating homes as a proactive response to climate change and coastal flooding.',
        source: 'BBC Future',
        country: 'Netherlands',
        images: [{ url: 'https://picsum.photos/id/124/1080/1920', placeholder: 'https://picsum.photos/id/124/20/35' }],
        influences: ['Sustainability', 'Innovation'],
        keywords: ['climate adaptation', 'floating homes', 'resilient design']
      },
      {
        id: '12',
        headline: 'The Timeless Allure of Mid-Century Modern Design',
        summary: 'Why do the clean lines, organic forms, and functional aesthetics of the 1950s and 60s continue to dominate contemporary design trends?',
        source: 'Dwell',
        country: 'USA',
        images: [{ url: 'https://picsum.photos/id/145/1080/1920', placeholder: 'https://picsum.photos/id/145/20/35' }],
        influences: ['Interior Design', 'Heritage'],
        keywords: ['mid-century modern', 'eames', 'design history']
      },
      {
        id: '13',
        headline: 'Mass Timber Construction Reaches New Heights',
        summary: 'A new 25-story tower built from cross-laminated timber (CLT) in Vancouver demonstrates the potential of wood as a sustainable alternative to steel and concrete.',
        source: 'Journal of Commerce',
        country: 'Canada',
        images: [{ url: 'https://picsum.photos/id/160/1080/1920', placeholder: 'https://picsum.photos/id/160/20/35' }],
        influences: ['Sustainability', 'Technology'],
        keywords: ['mass timber', 'clt', 'sustainable construction']
      },
      {
        id: '14',
        headline: 'NFTs and the Virtual Real Estate Boom',
        summary: 'Investors are spending millions on digital land in metaverses like Decentraland and The Sandbox, hiring virtual architects to design their properties.',
        source: 'Forbes',
        country: 'Global',
        images: [{ url: 'https://picsum.photos/id/163/1080/1920', placeholder: 'https://picsum.photos/id/163/20/35' }],
        influences: ['Technology', 'Innovation'],
        keywords: ['metaverse', 'nft', 'virtual architecture']
      },
      {
        id: '15',
        headline: 'How Ancient Roman Concrete Has Lasted for Millennia',
        summary: 'Scientists have finally unlocked the secrets of self-healing Roman concrete, which could lead to more durable modern construction materials.',
        source: 'National Geographic',
        country: 'Italy',
        images: [{ url: 'https://picsum.photos/id/180/1080/1920', placeholder: 'https://picsum.photos/id/180/20/35' }],
        influences: ['Heritage', 'Technology'],
        keywords: ['roman architecture', 'materials science', 'ancient technology']
      },
      {
        id: '16',
        headline: 'The Philosophy of Wabi-Sabi in Japanese Aesthetics',
        summary: 'Embracing imperfection, impermanence, and authenticity, the Japanese concept of wabi-sabi offers a profound alternative to Western beauty standards.',
        source: 'T: The NYTimes Style Magazine',
        country: 'Japan',
        images: [{ url: 'https://picsum.photos/id/200/1080/1920', placeholder: 'https://picsum.photos/id/200/20/35' }],
        influences: ['Global Culture', 'Minimalism'],
        keywords: ['wabi-sabi', 'japanese philosophy', 'aesthetics']
      },
      {
        id: '17',
        headline: 'Kinetic Façades: Buildings That Move and Adapt',
        summary: 'Dynamic building skins that respond to sunlight, wind, and temperature are creating more energy-efficient and visually stunning architecture.',
        source: 'Architizer',
        country: 'Global',
        images: [{ url: 'https://picsum.photos/id/211/1080/1920', placeholder: 'https://picsum.photos/id/211/20/35' }],
        influences: ['Technology', 'Sustainability'],
        keywords: ['kinetic architecture', 'smart materials', 'responsive design']
      },
      {
        id: '18',
        headline: 'Designing for Neurodiversity: Creating Inclusive Spaces',
        summary: 'Architects are now considering sensory sensitivities and cognitive differences to design schools, workplaces, and public spaces that are welcoming to everyone.',
        source: 'Metropolis',
        country: 'Global',
        images: [{ url: 'https://picsum.photos/id/219/1080/1920', placeholder: 'https://picsum.photos/id/219/20/35' }],
        influences: ['Social Impact', 'Wellbeing'],
        keywords: ['inclusive design', 'neurodiversity', 'universal design']
      }
    ];
  }
}
