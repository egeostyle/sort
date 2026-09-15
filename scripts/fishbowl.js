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

  // Shaking raffle animation sequence with vortex and 3D card extraction
  async animateRaffle(winningTicket, category) {
    sound.playShaking(2.5);

    // Lock interactions on fishbowl
    this.fishbowlEl.classList.add('is-locked', 'is-shaking');
    if (this.fishbowlEl.parentElement) {
      this.fishbowlEl.parentElement.classList.add('is-locked');
    }

    const bubbleInterval = setInterval(() => {
      this.burstBubbles(10);
    }, 150);

    // Shake & vortex for 2.4 seconds
    await new Promise(res => setTimeout(res, 2400));

    clearInterval(bubbleInterval);
    this.fishbowlEl.classList.remove('is-shaking');

    // 2. Launch 3D ticket upward out of fishbowl
    sound.playSplash();
    const stage = document.createElement('div');
    stage.className = 'launched-ticket-stage';

    const backdrop = document.createElement('div');
    backdrop.className = 'launched-ticket-backdrop';
    stage.appendChild(backdrop);

    const card = document.createElement('div');
    card.className = 'launched-ticket-card';
    const color = category.color || '#ffd166';
    card.style.background = `linear-gradient(135deg, ${color} 0%, #102a50 100%)`;

    const glimmer = document.createElement('div');
    glimmer.className = 'launched-ticket-glimmer';
    card.appendChild(glimmer);

    const senderText = (winningTicket.sender || 'General');
    card.innerHTML += `
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">
        <span style="display:flex; align-items:center; gap:4px; color:#ffd166;"><i class="fa-solid fa-star"></i> Sorteo</span>
        <span style="opacity:0.9;">● ${category.name}</span>
      </div>
      <div style="font-size:0.95rem; font-weight:800; line-height:1.25; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; text-shadow:0 2px 4px rgba(0,0,0,0.6);">
        ${winningTicket.title || 'Boleto Ganador'}
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.72rem; opacity:0.85;">
        <span>Por: <strong>${senderText}</strong></span>
        <span style="background:rgba(255,255,255,0.2); padding:2px 6px; border-radius:4px; font-weight:700;">#Ganador</span>
      </div>
    `;

    stage.appendChild(card);
    document.body.appendChild(stage);

    await new Promise(res => setTimeout(res, 1800));
    stage.remove();

    // 3. Victory sound
    sound.playTada();

    this.fishbowlEl.classList.remove('is-locked');
    if (this.fishbowlEl.parentElement) {
      this.fishbowlEl.parentElement.classList.remove('is-locked');
    }
  }
}
