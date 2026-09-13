/**
 * Pecera Social - Fishbowl Renderer & Physics
 * Controls tickets floating in water, shaking animations, and ticket launch.
 */

import { store } from './store.js';
import { sound } from './sound.js';

export class FishbowlController {
  constructor(options = {}) {
    this.fishbowlEl = document.getElementById('fishbowl');
    this.ticketsLayer = document.getElementById('tickets-water-layer');
    this.bubblesLayer = document.getElementById('bowl-bubbles-container');
    this.emptyStateEl = document.getElementById('fishbowl-empty-state');
    this.counterEl = document.getElementById('ticket-counter-val');
    this.counterBadgeEl = document.getElementById('counter-badge');

    this.init();
  }

  init() {
    this.spawnContinuousBubbles();
    this.renderTickets();

    // Listen to store events
    store.on('TICKETS_UPDATED', () => this.renderTickets());
    store.on('TICKET_ADDED', (ticket) => this.handleTicketAdded(ticket));
    store.on('TICKET_DELETED', () => this.renderTickets());
    store.on('TICKETS_CLEARED', () => this.renderTickets());
  }

  renderTickets() {
    const tickets = store.tickets;
    const count = tickets.length;

    // Update counter
    if (this.counterEl) {
      this.counterEl.textContent = count;
    }
    if (this.counterBadgeEl) {
      this.counterBadgeEl.classList.remove('bump');
      void this.counterBadgeEl.offsetWidth; // Trigger reflow
      this.counterBadgeEl.classList.add('bump');
    }

    // Empty state
    if (this.emptyStateEl) {
      this.emptyStateEl.style.display = count === 0 ? 'block' : 'none';
    }

    if (!this.ticketsLayer) return;
    this.ticketsLayer.innerHTML = '';

    // Render up to 28 visible tickets to keep DOM light and aesthetic
    const visibleCount = Math.min(count, 28);
    for (let i = 0; i < visibleCount; i++) {
      const ticket = tickets[i];
      const category = store.getCategory(ticket.categoryId);
      const ticketEl = this.createFloatingTicketElement(ticket, category, i, visibleCount);
      this.ticketsLayer.appendChild(ticketEl);
    }
  }

  createFloatingTicketElement(ticket, category, index, total) {
    const el = document.createElement('div');
    el.className = 'water-ticket';
    el.title = `${ticket.title} (${category.name})`;

    const color = category.color || '#00e5ff';
    el.style.background = `linear-gradient(135deg, ${color}ee 0%, ${color}aa 100%)`;
    el.style.borderColor = 'rgba(255, 255, 255, 0.75)';

    // Golden-ratio harmonic distribution inside the submerged water volume
    const goldenAngle = 137.508 * (Math.PI / 180);
    const angle = index * goldenAngle;
    const spreadProgress = (index % 7) / 6;
    const radiusX = 15 + (spreadProgress * 25);
    const radiusY = 12 + (((index % 5) / 4) * 22);

    const posX = 50 + (Math.cos(angle) * radiusX);
    const posY = 52 + (Math.sin(angle) * radiusY);

    const rot = -24 + ((index * 33) % 48);
    const scale = 0.90 + ((index % 4) * 0.06);
    const opacity = 0.88 + ((index % 3) * 0.06);

    // Keep completely submerged inside water layer (avoiding surface meniscus)
    el.style.left = `${Math.max(12, Math.min(84, posX))}%`;
    el.style.top = `${Math.max(22, Math.min(78, posY))}%`;
    el.style.opacity = opacity.toFixed(2);
    el.style.zIndex = Math.floor(scale * 10);
    el.style.setProperty('--rot', `${rot}deg`);
    el.style.setProperty('--scale', scale.toFixed(2));
    el.style.setProperty('--tx', `${(index % 3 - 1) * 6}px`);
    el.style.setProperty('--ty', `${(index % 2 === 0 ? -6 : 6)}px`);
    el.style.animationDelay = `${(index * 0.35) % 3.5}s`;
    el.style.animationDuration = `${4 + ((index % 3) * 0.5)}s`;

    // High aesthetic ticket label with star badge
    el.innerHTML = `<span class="ticket-number-label"><span class="ticket-star">★</span>#${total - index}</span>`;

    return el;
  }

  handleTicketAdded(ticket) {
    sound.playSplash();
    this.renderTickets();
    this.burstBubbles(12);
  }

  // Atmospheric continuous bubbles inside fishbowl
  spawnContinuousBubbles() {
    if (!this.bubblesLayer) return;

    setInterval(() => {
      if (document.hidden) return;
      const bubble = document.createElement('div');
      bubble.className = 'bowl-bubble';

      const size = 5 + Math.random() * 9;
      const posX = 15 + Math.random() * 70;
      const drift = -15 + Math.random() * 30;
      const duration = 2.5 + Math.random() * 2;

      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${posX}%`;
      bubble.style.setProperty('--drift', `${drift}px`);
      bubble.style.animationDuration = `${duration}s`;

      this.bubblesLayer.appendChild(bubble);

      setTimeout(() => {
        bubble.remove();
      }, duration * 1000);
    }, 900);
  }

  burstBubbles(count = 15) {
    if (!this.bubblesLayer) return;
    for (let i = 0; i < count; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bowl-bubble';

      const size = 6 + Math.random() * 12;
      const posX = 20 + Math.random() * 60;
      const drift = -25 + Math.random() * 50;
      const duration = 1.2 + Math.random() * 1.5;

      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${posX}%`;
      bubble.style.setProperty('--drift', `${drift}px`);
      bubble.style.animationDuration = `${duration}s`;

      this.bubblesLayer.appendChild(bubble);
      setTimeout(() => bubble.remove(), duration * 1000);
    }
  }

  // Shaking raffle animation sequence
  async animateRaffle(winningTicket, category) {
    sound.playShaking(2.4);

    // 1. Start intense shaking
    this.fishbowlEl.classList.add('is-shaking');
    const bubbleInterval = setInterval(() => this.burstBubbles(8), 180);

    // Shake for 2.2 seconds
    await new Promise(res => setTimeout(res, 2200));

    clearInterval(bubbleInterval);
    this.fishbowlEl.classList.remove('is-shaking');

    // 2. Launch ticket upward out of fishbowl
    sound.playSplash();
    const stage = document.createElement('div');
    stage.className = 'launched-ticket-stage';

    const launchedTicket = document.createElement('div');
    launchedTicket.className = 'launched-ticket';
    launchedTicket.style.backgroundColor = category.color || '#ffd166';
    stage.appendChild(launchedTicket);
    document.body.appendChild(stage);

    await new Promise(res => setTimeout(res, 1200));
    stage.remove();

    // 3. Victory sound
    sound.playTada();
  }
}
