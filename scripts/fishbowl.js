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
    el.style.background = `linear-gradient(135deg, ${color}f2 0%, ${color}c0 100%)`;
    el.style.borderColor = 'rgba(255, 255, 255, 0.9)';

    // Golden-ratio harmonic distribution inside the submerged water volume
    const goldenAngle = 137.508 * (Math.PI / 180);
    const angle = index * goldenAngle;
    const spreadProgress = (index % 7) / 6;
    const radiusX = 8 + (spreadProgress * 20);
    const radiusY = 7 + (((index % 5) / 4) * 16);

    const posX = 50 + (Math.cos(angle) * radiusX);
    const posY = 54 + (Math.sin(angle) * radiusY);

    const rot = -20 + ((index * 29) % 40);
    const scale = 0.88 + ((index % 4) * 0.05);
    const opacity = 0.92 + ((index % 3) * 0.04);

    // Keep completely submerged safely inside water belly
    el.style.left = `${Math.max(22, Math.min(78, posX))}%`;
    el.style.top = `${Math.max(28, Math.min(74, posY))}%`;
    el.style.opacity = opacity.toFixed(2);
    el.style.zIndex = Math.floor(scale * 10);
    el.style.setProperty('--rot', `${rot}deg`);
    el.style.setProperty('--scale', scale.toFixed(2));
    el.style.setProperty('--tx', `${(index % 3 - 1) * 4}px`);
    el.style.setProperty('--ty', `${(index % 2 === 0 ? -4 : 4)}px`);
    el.style.animationDelay = `${(index * 0.35) % 3.5}s`;
    el.style.animationDuration = `${4 + ((index % 3) * 0.5)}s`;

    // Sleek mini ticket stub without bulky numbers or star icons
    el.innerHTML = '<span class="ticket-mini-perforation"></span>';

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

  // Tournament / Versus mode animation (3 candidates clash)
  async animateTournamentRaffle(candidates, finalWinner, category) {
    sound.playShaking(2.2);

    // Lock interactions on fishbowl
    this.fishbowlEl.classList.add('is-locked', 'is-shaking');
    if (this.fishbowlEl.parentElement) {
      this.fishbowlEl.parentElement.classList.add('is-locked');
    }

    const bubbleInterval = setInterval(() => {
      this.burstBubbles(10);
    }, 150);

    // Shake & vortex for 2.2 seconds
    await new Promise(res => setTimeout(res, 2200));

    clearInterval(bubbleInterval);
    this.fishbowlEl.classList.remove('is-shaking');

    // Dramatic Versus Gong
    sound.playVersusGong();

    // Create Tournament Arena Overlay
    const stage = document.createElement('div');
    stage.className = 'tournament-stage';

    const backdrop = document.createElement('div');
    backdrop.className = 'tournament-backdrop';
    stage.appendChild(backdrop);

    const arena = document.createElement('div');
    arena.className = 'tournament-arena';

    arena.innerHTML = `
      <div class="tournament-header">
        <span class="tournament-badge">
          <i class="fa-solid fa-bolt" style="color:#ffd166;"></i> MODO TORNEO
        </span>
        <h2 class="tournament-title">⚡ VERSUS ⚡</h2>
        <p class="tournament-sub">3 Finalistas compitiendo por la victoria</p>
      </div>
      <div class="tournament-cards-grid">
        ${candidates.map((cand, idx) => {
          const isYenka = (cand.sender || '').toLowerCase().includes('yenka');
          const senderLabel = isYenka ? 'Yenka' : 'George';
          const senderClass = isYenka ? 'sender-yenka' : 'sender-george';
          const senderIcon = isYenka ? 'fa-heart' : 'fa-user';
          const color = store.getCategory(cand.categoryId)?.color || '#00e5ff';

          return `
            <div class="tournament-cand-card" id="cand-${cand.id}" data-id="${cand.id}">
              <div class="tournament-cand-num">#${idx + 1}</div>
              <div class="tournament-cand-tag" style="border-color:${color}; color:${color};">
                ● ${store.getCategory(cand.categoryId)?.name || 'General'}
              </div>
              <div class="tournament-cand-title">${cand.title || 'Boleto'}</div>
              <div class="tournament-cand-footer">
                <span class="sender-badge sender-badge-${senderClass}">
                  <i class="fa-solid ${senderIcon}"></i> ${senderLabel}
                </span>
                <span class="cand-status-badge">En juego</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    stage.appendChild(arena);
    document.body.appendChild(stage);

    // Initial suspense pause to inspect the 3 contenders
    await new Promise(res => setTimeout(res, 1700));

    // Get non-winning contenders to eliminate one by one
    const nonWinners = candidates.filter(c => c.id !== finalWinner.id);

    // Elimination 1
    if (nonWinners.length > 0) {
      const firstOut = nonWinners[0];
      const elFirst = stage.querySelector(`#cand-${firstOut.id}`);
      if (elFirst) {
        sound.playVersusClash();
        elFirst.classList.add('is-eliminated');
        const badge = elFirst.querySelector('.cand-status-badge');
        if (badge) {
          badge.textContent = 'Descartado ❌';
          badge.style.background = 'rgba(255, 64, 96, 0.2)';
          badge.style.color = '#ff4d6d';
        }
      }
      await new Promise(res => setTimeout(res, 1200));
    }

    // Elimination 2
    if (nonWinners.length > 1) {
      const secondOut = nonWinners[1];
      const elSecond = stage.querySelector(`#cand-${secondOut.id}`);
      if (elSecond) {
        sound.playVersusClash();
        elSecond.classList.add('is-eliminated');
        const badge = elSecond.querySelector('.cand-status-badge');
        if (badge) {
          badge.textContent = 'Descartado ❌';
          badge.style.background = 'rgba(255, 64, 96, 0.2)';
          badge.style.color = '#ff4d6d';
        }
      }
      await new Promise(res => setTimeout(res, 1000));
    }

    // Crown the final champion!
    const elWinner = stage.querySelector(`#cand-${finalWinner.id}`);
    if (elWinner) {
      elWinner.classList.add('is-champion');
      const badge = elWinner.querySelector('.cand-status-badge');
      if (badge) {
        badge.innerHTML = '👑 ¡GANADOR!';
        badge.style.background = 'rgba(255, 209, 102, 0.3)';
        badge.style.color = '#ffd166';
      }
    }

    sound.playTada();
    await new Promise(res => setTimeout(res, 1600));

    // Fade out stage
    stage.classList.add('fade-out');
    await new Promise(res => setTimeout(res, 400));
    stage.remove();

    this.fishbowlEl.classList.remove('is-locked');
    if (this.fishbowlEl.parentElement) {
      this.fishbowlEl.parentElement.classList.remove('is-locked');
    }
  }
}
