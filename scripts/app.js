/**
 * Pecera Social - Main Application Coordinator
 * Handles user interactions, preview resolution, raffle execution, mobile shortcuts and cloud sync.
 */

import { store } from './store.js';
import { PLATFORMS, resolveSocialMetadata } from './social.js';
import { FishbowlController } from './fishbowl.js';
import { ConfettiCannon } from './confetti.js';
import { sound } from './sound.js';
import { firebaseSync } from './firebase-sync.js';
import { shortcutsGuide } from './shortcuts-guide.js';

class App {
  constructor() {
    this.currentPreviewData = null;
    this.selectedRaffleCategory = 'all';
    this.selectedRaffleSender = 'all';
    this.ticketsListSenderFilter = 'all';
    this.currentWinner = null;
    this.fishbowlController = null;
    this.confetti = null;

    this.dom = {
      // Input & Preview
      urlInput: document.getElementById('url-input'),
      btnPaste: document.getElementById('btn-paste'),
      previewContainer: document.getElementById('preview-container'),
      senderPillsGroup: document.getElementById('sender-pills-group'),
      
      // Fishbowl
      fishbowl: document.getElementById('fishbowl'),
      
      // Header, Footer & Counters
      btnCloudStatus: document.getElementById('btn-cloud-status'),
      cloudStatusDot: document.getElementById('cloud-status-dot'),
      cloudStatusText: document.getElementById('cloud-status-text'),
      btnMobileConnect: document.getElementById('btn-mobile-connect'),
      btnCategories: document.getElementById('btn-categories'),
      btnAddCategoryQuick: document.getElementById('btn-add-category-quick'),
      counterPill: document.getElementById('counter-pill'),
      btnAudioToggle: document.getElementById('btn-audio-toggle'),
      
      // Modals
      categoryDialog: document.getElementById('category-dialog'),
      btnCloseCategoryModal: document.getElementById('btn-close-category-modal'),
      categoryList: document.getElementById('category-list'),
      addCategoryForm: document.getElementById('add-category-form'),
      newCatNameInput: document.getElementById('new-cat-name'),
      paletteContainer: document.getElementById('palette-container'),

      raffleDialog: document.getElementById('raffle-dialog'),
      btnCloseRaffleModal: document.getElementById('btn-close-raffle-modal'),
      raffleSenderFilterGroup: document.getElementById('raffle-sender-filter-group'),
      raffleCategoriesGrid: document.getElementById('raffle-categories-grid'),
      btnConfirmRaffle: document.getElementById('btn-confirm-raffle'),

      winnerDialog: document.getElementById('winner-dialog'),
      btnCloseWinnerModal: document.getElementById('btn-close-winner-modal'),
      winnerCardContainer: document.getElementById('winner-card-body'),
      btnRaffleAgain: document.getElementById('btn-raffle-again'),

      ticketsListDialog: document.getElementById('tickets-list-dialog'),
      btnCloseTicketsModal: document.getElementById('btn-close-tickets-modal'),
      ticketsSenderFilterGroup: document.getElementById('tickets-sender-filter-group'),
      countGeorge: document.getElementById('count-george'),
      countYenka: document.getElementById('count-yenka'),
      allTicketsContainer: document.getElementById('all-tickets-container'),
      btnExportData: document.getElementById('btn-export-data'),
      btnImportData: document.getElementById('btn-import-data'),
      importFileInput: document.getElementById('import-file-input'),

      mobileConnectDialog: document.getElementById('mobile-connect-dialog'),
      btnCloseMobileModal: document.getElementById('btn-close-mobile-modal'),
      iphoneStepsContainer: document.getElementById('iphone-steps-container'),
      androidStepsContainer: document.getElementById('android-steps-container'),
      btnTestYenkaTicket: document.getElementById('btn-test-yenka-ticket'),
      btnTestGeorgeTicket: document.getElementById('btn-test-george-ticket'),
      firebaseStatusBanner: document.getElementById('firebase-status-banner'),
      firebaseConfigForm: document.getElementById('firebase-config-form'),
      fbProjectId: document.getElementById('fb-project-id'),
      fbApiKey: document.getElementById('fb-api-key'),
      btnFbDisconnect: document.getElementById('btn-fb-disconnect'),

      confettiCanvas: document.getElementById('confetti-canvas'),
      toastContainer: document.getElementById('toast-container')
    };
  }

  init() {
    this.fishbowlController = new FishbowlController();
    this.confetti = new ConfettiCannon(this.dom.confettiCanvas);

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.warn('PWA Service Worker registration skipped/failed:', err);
      });
    }

    this.bindEvents();
    this.renderCategoryPalettes();
    this.setupAmbientBubbles();
    this.updateSoundToggleState();
    this.updateSenderPillSelection();
    this.setupFirebaseStatusListener();
    this.handleIncomingShareParams();

    // Open mobile modal if hash is #celulares
    if (window.location.hash === '#celulares') {
      this.openMobileConnectModal('tab-iphone');
    }

    // If new tickets arrived from cloud or shortcut
    store.on('REMOTE_TICKETS_ARRIVED', (items) => {
      sound.playSplash();
      const first = items[0];
      const senderText = first.sender ? `de ${first.sender}` : '';
      this.showToast(`✨ ¡Nuevo boleto sumergido en vivo ${senderText}!`);
    });

    // If user presses enter on input
    this.dom.urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleUrlInput(this.dom.urlInput.value);
      }
    });

    console.log('🐟 Pecera Social inicializada con éxito.');
  }

  bindEvents() {
    // 1. URL input paste & input
    this.dom.urlInput.addEventListener('input', (e) => {
      this.handleUrlInput(e.target.value);
    });

    this.dom.btnPaste.addEventListener('click', async () => {
      sound.playBubble();
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          this.dom.urlInput.value = text;
          this.handleUrlInput(text);
        } else {
          this.dom.urlInput.focus();
        }
      } catch (err) {
        this.dom.urlInput.focus();
      }
    });

    // 2. Fishbowl click -> Raffle prompt
    this.dom.fishbowl.addEventListener('click', () => {
      sound.playBubble();
      this.openRafflePrompt();
    });

    // 3. Category modal
    this.dom.btnCategories.addEventListener('click', () => {
      sound.playBubble();
      this.openCategoryModal();
    });

    this.dom.btnAddCategoryQuick.addEventListener('click', () => {
      sound.playBubble();
      this.openCategoryModal();
      this.dom.newCatNameInput.focus();
    });

    this.dom.btnCloseCategoryModal.addEventListener('click', () => {
      this.dom.categoryDialog.close();
    });

    // 4. Counter pill -> Open all tickets list
    this.dom.counterPill.addEventListener('click', () => {
      sound.playBubble();
      this.openTicketsListModal();
    });

    this.dom.btnCloseTicketsModal.addEventListener('click', () => {
      this.dom.ticketsListDialog.close();
    });

    // 5. Raffle dialog
    this.dom.btnCloseRaffleModal.addEventListener('click', () => {
      this.dom.raffleDialog.close();
    });

    this.dom.btnConfirmRaffle.addEventListener('click', () => {
      this.executeRaffle();
    });

    // 6. Winner dialog
    this.dom.btnCloseWinnerModal.addEventListener('click', () => {
      this.dom.winnerDialog.close();
    });

    this.dom.btnRaffleAgain.addEventListener('click', () => {
      this.dom.winnerDialog.close();
      this.openRafflePrompt();
    });

    // 7. Audio toggle
    this.dom.btnAudioToggle.addEventListener('click', () => {
      const nextState = !store.settings.soundEnabled;
      store.setSoundEnabled(nextState);
      this.updateSoundToggleState();
      if (nextState) sound.playBubble();
    });

    // 8. Add category form submission
    this.dom.addCategoryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = this.dom.newCatNameInput.value.trim();
      const selectedDot = this.dom.paletteContainer.querySelector('.palette-color-choice.selected');
      const color = selectedDot ? selectedDot.dataset.color : '#00e5ff';

      if (!name) return;
      store.addCategory(name, color);
      this.dom.newCatNameInput.value = '';
      this.renderCategoryList();
      this.showToast(`Categoría "${name}" creada.`);
      sound.playBubble();
    });

    // 9. Export & Import Backup
    this.dom.btnExportData.addEventListener('click', () => {
      const data = store.exportBackup();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pecera-social-backup-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      this.showToast('Respaldo exportado correctamente.');
    });

    this.dom.btnImportData.addEventListener('click', () => {
      this.dom.importFileInput.click();
    });

    this.dom.importFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const success = store.importBackup(event.target.result);
        if (success) {
          this.showToast('Boletos y categorías importados exitosamente.');
          this.renderTicketsList();
        } else {
          alert('El archivo no tiene el formato JSON de respaldo válido.');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    // 10. Sender Pills (George / Yenka) selection in input bar
    if (this.dom.senderPillsGroup) {
      const pills = this.dom.senderPillsGroup.querySelectorAll('.sender-pill');
      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          sound.playBubble();
          const sender = pill.dataset.sender;
          store.setActiveSender(sender);
          this.updateSenderPillSelection();
          this.showToast(`Remitente activo: ${sender === 'Yenka' ? '💖 Yenka' : '🔵 George'}`);
        });
      });
    }

    // 11. Mobile Shortcuts Modal
    if (this.dom.btnMobileConnect) {
      this.dom.btnMobileConnect.addEventListener('click', () => {
        sound.playBubble();
        this.openMobileConnectModal('tab-iphone');
      });
    }

    if (this.dom.btnCloudStatus) {
      this.dom.btnCloudStatus.addEventListener('click', () => {
        sound.playBubble();
        this.openMobileConnectModal('tab-firebase');
      });
    }

    if (this.dom.btnCloseMobileModal) {
      this.dom.btnCloseMobileModal.addEventListener('click', () => {
        this.dom.mobileConnectDialog.close();
      });
    }

    // Modal Tabs switcher
    if (this.dom.mobileConnectDialog) {
      const tabButtons = this.dom.mobileConnectDialog.querySelectorAll('.tab-btn');
      tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          sound.playBubble();
          const targetTab = btn.dataset.tab;
          this.switchMobileTab(targetTab);
        });
      });
    }

    // Test simulation buttons in mobile modal
    if (this.dom.btnTestYenkaTicket) {
      this.dom.btnTestYenkaTicket.addEventListener('click', async () => {
        sound.playSplash();
        const simTicket = await shortcutsGuide.simulateExternalShare('Yenka');
        store.addTicket(simTicket);
        this.showToast('💖 ¡Boleto simulado de Yenka sumergido con éxito!');
      });
    }

    if (this.dom.btnTestGeorgeTicket) {
      this.dom.btnTestGeorgeTicket.addEventListener('click', async () => {
        sound.playSplash();
        const simTicket = await shortcutsGuide.simulateExternalShare('George');
        store.addTicket(simTicket);
        this.showToast('🔵 ¡Boleto simulado de George sumergido con éxito!');
      });
    }

    // Firebase Config Form
    if (this.dom.firebaseConfigForm) {
      this.dom.firebaseConfigForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const projectId = this.dom.fbProjectId.value.trim();
        const apiKey = this.dom.fbApiKey.value.trim();

        if (!projectId || !apiKey) {
          alert('Por favor ingresa tanto el Project ID como el API Key.');
          return;
        }

        firebaseSync.saveConfig({ projectId, apiKey });
        this.showToast('Configuración guardada. Conectando a Firebase...');
        this.updateFirebaseStatusBanner();
        this.renderMobileShortcutsGuide();
      });
    }

    if (this.dom.btnFbDisconnect) {
      this.dom.btnFbDisconnect.addEventListener('click', () => {
        firebaseSync.saveConfig(null);
        if (this.dom.fbProjectId) this.dom.fbProjectId.value = '';
        if (this.dom.fbApiKey) this.dom.fbApiKey.value = '';
        this.showToast('Desconectado de Firebase. Modo local activo.');
        this.updateFirebaseStatusBanner();
        this.renderMobileShortcutsGuide();
      });
    }

    // 12. Raffle Sender Filter Pills
    if (this.dom.raffleSenderFilterGroup) {
      const rPills = this.dom.raffleSenderFilterGroup.querySelectorAll('.sender-pill');
      rPills.forEach(rp => {
        rp.addEventListener('click', () => {
          sound.playBubble();
          rPills.forEach(p => p.classList.remove('active'));
          rp.classList.add('active');
          this.selectedRaffleSender = rp.dataset.raffleSender;
          this.refreshRaffleCategoriesCount();
        });
      });
    }

    // 13. Tickets List Sender Filter Pills
    if (this.dom.ticketsSenderFilterGroup) {
      const tPills = this.dom.ticketsSenderFilterGroup.querySelectorAll('.sender-pill');
      tPills.forEach(tp => {
        tp.addEventListener('click', () => {
          sound.playBubble();
          tPills.forEach(p => p.classList.remove('active'));
          tp.classList.add('active');
          this.ticketsListSenderFilter = tp.dataset.filterSender;
          this.renderTicketsList(this.ticketsListSenderFilter);
        });
      });
    }
  }

  // Handle URL parsing and preview display
  async handleUrlInput(rawText) {
    const text = rawText.trim();
    if (!text || !text.startsWith('http')) {
      this.dom.previewContainer.innerHTML = '';
      this.currentPreviewData = null;
      return;
    }

    try {
      this.dom.previewContainer.innerHTML = `
        <div class="preview-card" style="align-items:center; justify-content:center; padding: 1.5rem;">
          <span style="display:flex; align-items:center; gap: 0.5rem; color: var(--accent-cyan);">
            <svg class="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            Analizando publicación...
          </span>
        </div>
      `;

      const metadata = await resolveSocialMetadata(text);
      this.currentPreviewData = metadata;
      this.renderPreviewCard(metadata);
    } catch (err) {
      this.dom.previewContainer.innerHTML = '';
    }
  }

  renderPreviewCard(data) {
    const platformConfig = PLATFORMS[data.platform.toUpperCase()] || PLATFORMS.GENERIC;
    const categories = store.categories;

    const optionsHtml = categories.map(cat => 
      `<option value="${cat.id}">${cat.name}</option>`
    ).join('');

    const activeSender = store.activeSender || 'George';
    const isYenka = activeSender.toLowerCase().includes('yenka');
    const senderBadge = isYenka
      ? '<span class="sender-badge sender-badge-yenka">💖 Yenka</span>'
      : '<span class="sender-badge sender-badge-george">🔵 George</span>';

    this.dom.previewContainer.innerHTML = `
      <div class="preview-card">
        <div class="preview-thumbnail-box">
          <img src="${data.thumbnail}" class="preview-img" alt="Vista previa" onerror="this.src='${data.thumbnail}'" />
          <span class="preview-media-type-badge">${data.mediaType}</span>
        </div>
        <div class="preview-content">
          <div>
            <div class="preview-header-meta">
              <span class="platform-pill platform-${data.platform}">
                ${platformConfig.iconSvg} ${platformConfig.name}
              </span>
              ${senderBadge}
              <span class="preview-author">${data.author}</span>
            </div>
            <h4 class="preview-title">${data.title}</h4>
          </div>

          <div class="preview-controls">
            <div class="category-select-wrapper">
              <label class="category-select-label">Categoría:</label>
              <select id="preview-category-select" class="select-category">
                ${optionsHtml}
              </select>
            </div>
            <button id="btn-add-to-bowl" class="btn btn-primary" style="padding: 0.45rem 1rem; font-size: 0.85rem;">
              💧 Sumergir en Pecera
            </button>
          </div>
        </div>
      </div>
    `;

    // Bind add button
    const btnAdd = document.getElementById('btn-add-to-bowl');
    const categorySelect = document.getElementById('preview-category-select');

    btnAdd.addEventListener('click', () => {
      const selectedCatId = categorySelect.value;
      const ticket = store.addTicket({
        url: data.url,
        platform: data.platform,
        title: data.title,
        author: data.author,
        thumbnail: data.thumbnail,
        mediaType: data.mediaType,
        categoryId: selectedCatId,
        sender: store.activeSender
      });

      this.showToast(`¡Boleto de ${store.activeSender === 'Yenka' ? 'Yenka 💖' : 'George 🔵'} sumergido y guardado!`);
      this.dom.urlInput.value = '';
      this.dom.previewContainer.innerHTML = '';
      this.currentPreviewData = null;
    });
  }

  // Raffle selection prompt
  openRafflePrompt() {
    const totalCount = store.getTicketCount(null, this.selectedRaffleSender);
    if (totalCount === 0) {
      const senderText = this.selectedRaffleSender === 'Yenka' ? 'de Yenka' : (this.selectedRaffleSender === 'George' ? 'de George' : '');
      this.showToast(`⚠️ No hay boletos ${senderText} en la pecera.`);
      return;
    }

    this.refreshRaffleCategoriesCount();
    this.dom.raffleDialog.showModal();
  }

  refreshRaffleCategoriesCount() {
    const sender = this.selectedRaffleSender || 'all';
    const count = store.getTicketCount('all', sender);
    const categories = store.categories;

    let html = `
      <button class="raffle-choice-btn ${this.selectedRaffleCategory === 'all' ? 'active' : ''}" data-category="all">
        <span class="raffle-btn-name">🌟 Todas</span>
        <span class="raffle-btn-count">${count} boletos</span>
      </button>
    `;

    categories.forEach(cat => {
      const catCount = store.getTicketCount(cat.id, sender);
      html += `
        <button class="raffle-choice-btn ${this.selectedRaffleCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
          <span class="raffle-btn-name" style="color: ${cat.color};">● ${cat.name}</span>
          <span class="raffle-btn-count">${catCount} boletos</span>
        </button>
      `;
    });

    this.dom.raffleCategoriesGrid.innerHTML = html;

    const choiceButtons = this.dom.raffleCategoriesGrid.querySelectorAll('.raffle-choice-btn');
    choiceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playBubble();
        choiceButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedRaffleCategory = btn.dataset.category;
      });
    });
  }

  async executeRaffle() {
    const catId = this.selectedRaffleCategory;
    const sender = this.selectedRaffleSender;
    const poolCount = store.getTicketCount(catId, sender);

    if (poolCount === 0) {
      alert('No hay boletos con los filtros seleccionados.');
      return;
    }

    this.dom.raffleDialog.close();

    const winner = store.drawRandomTicket(catId, sender);
    this.currentWinner = winner;
    const category = store.getCategory(winner.categoryId);

    // Run animation sequence
    await this.fishbowlController.animateRaffle(winner, category);

    // Launch celebratory confetti
    this.confetti.fire(120);

    // Show winner card
    this.renderWinnerCard(winner, category);
    this.dom.winnerDialog.showModal();
  }

  renderWinnerCard(winner, category) {
    const platformConfig = PLATFORMS[winner.platform.toUpperCase()] || PLATFORMS.GENERIC;
    const authorLine = winner.author ? `👤 Creador: ${winner.author}\n` : '';
    const senderName = winner.sender || 'George';
    const isYenka = senderName.toLowerCase().includes('yenka');
    const senderDisplay = isYenka ? 'Yenka 💖' : 'George 🔵';
    const senderBadgeHtml = isYenka 
      ? '<span class="sender-badge sender-badge-yenka">💖 Yenka</span>' 
      : '<span class="sender-badge sender-badge-george">🔵 George</span>';

    const shareMessage = `🎉 ¡Tenemos un Ganador en Pecera Social! 🏆\n\n🎟️ Sumergido por: ${senderDisplay}\n📌 Publicación: ${winner.title}\n${authorLine}🏷️ Categoría: ${category.name}\n\n🔗 Ver publicación original:\n${winner.url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;

    const mediaPreviewHtml = winner.thumbnail ? `
      <img src="${winner.thumbnail}" class="winner-img" alt="${winner.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
      <div class="winner-img-fallback" style="display:none; background: ${platformConfig.gradient};">
        ${platformConfig.iconSvg}
      </div>
    ` : `
      <div class="winner-img-fallback" style="background: ${platformConfig.gradient};">
        ${platformConfig.iconSvg}
      </div>
    `;

    this.dom.winnerCardContainer.innerHTML = `
      <div class="winner-ticket-card">
        <div class="winner-media-preview">
          ${mediaPreviewHtml}
          <span class="preview-media-type-badge">${winner.mediaType}</span>
        </div>

        <div class="winner-details">
          <div class="winner-tag-row">
            <span class="platform-pill platform-${winner.platform}">
              ${platformConfig.iconSvg} ${platformConfig.name}
            </span>
            <span class="category-count" style="border: 1px solid ${category.color}; color: ${category.color}; font-weight:700;">
              ● ${category.name}
            </span>
            ${senderBadgeHtml}
          </div>

          <h3 class="winner-title">${winner.title}</h3>
          <p class="winner-author">${winner.author || ''}</p>
        </div>

        <div class="winner-actions-grid">
          <a href="${winner.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-action-post" title="Abrir publicación original en ${platformConfig.name}">
            <span>🔗 Abrir publicación original</span> ↗
          </a>
          <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-action-share" title="Enviar enlace del ganador por WhatsApp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.98-.276-.1-.477-.15-.678.15-.2.301-.777.98-.953 1.18-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.085-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.239-.245-.589-.494-.509-.678-.518-.175-.009-.376-.01-.577-.01-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.511 1.079 2.912 1.23 3.113c.15.2 2.122 3.24 5.14 4.544.718.31 1.278.495 1.716.634.721.23 1.378.198 1.897.12.578-.087 1.782-.728 2.033-1.432.251-.703.251-1.306.175-1.432-.075-.125-.276-.2-.577-.35zM12.04 2c-5.52 0-10 4.48-10 10 0 1.85.5 3.58 1.38 5.08L2 22l5.06-1.33A9.97 9.97 0 0 0 12.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18.25c-1.62 0-3.13-.48-4.41-1.31l-.32-.2-3.27.86.87-3.19-.21-.34a8.21 8.21 0 0 1-1.26-4.32c0-4.55 3.7-8.25 8.25-8.25 4.55 0 8.25 3.7 8.25 8.25 0 4.55-3.7 8.25-8.25 8.25z"/>
            </svg>
            <span>Compartir</span>
          </a>
        </div>
      </div>
    `;
  }

  // Category management modal
  openCategoryModal() {
    this.renderCategoryList();
    this.dom.categoryDialog.showModal();
  }

  renderCategoryList() {
    const categories = store.categories;
    this.dom.categoryList.innerHTML = categories.map(cat => {
      const count = store.getTicketCount(cat.id);
      return `
        <div class="category-row">
          <div class="category-info">
            <span class="category-color-dot" style="background-color: ${cat.color};"></span>
            <span class="category-name">${cat.name}</span>
          </div>
          <div style="display:flex; align-items:center; gap: 0.6rem;">
            <span class="category-count">${count} tickets</span>
            ${categories.length > 1 ? `
              <button class="btn-delete-category" data-id="${cat.id}" title="Eliminar categoría">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Bind delete buttons
    this.dom.categoryList.querySelectorAll('.btn-delete-category').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (confirm('¿Deseas eliminar esta categoría? Sus boletos pasarán a la categoría principal.')) {
          store.deleteCategory(id);
          this.renderCategoryList();
          this.showToast('Categoría eliminada.');
        }
      });
    });
  }

  renderCategoryPalettes() {
    const colors = ['#00e5ff', '#ffd166', '#ff2a85', '#a855f7', '#06d6a0', '#ff7a00', '#2979ff', '#ffffff'];
    this.dom.paletteContainer.innerHTML = colors.map((c, i) => `
      <div class="palette-color-choice ${i === 0 ? 'selected' : ''}" data-color="${c}" style="background-color: ${c};"></div>
    `).join('');

    const dots = this.dom.paletteContainer.querySelectorAll('.palette-color-choice');
    dots.forEach(d => {
      d.addEventListener('click', () => {
        dots.forEach(item => item.classList.remove('selected'));
        d.classList.add('selected');
      });
    });
  }

  // All tickets list modal
  openTicketsListModal() {
    this.updateSenderCountsDisplay();
    this.renderTicketsList(this.ticketsListSenderFilter);
    this.dom.ticketsListDialog.showModal();
  }

  updateSenderCountsDisplay() {
    const counts = store.getSenderCounts();
    if (this.dom.countGeorge) this.dom.countGeorge.textContent = counts.george;
    if (this.dom.countYenka) this.dom.countYenka.textContent = counts.yenka;
  }

  renderTicketsList(senderFilter = this.ticketsListSenderFilter) {
    this.updateSenderCountsDisplay();
    const tickets = store.getTickets(null, senderFilter);
    
    if (tickets.length === 0) {
      this.dom.allTicketsContainer.innerHTML = `
        <div style="text-align:center; padding: 2rem; color: var(--text-muted);">
          No hay boletos ${senderFilter !== 'all' ? `de ${senderFilter}` : ''} guardados todavía.
        </div>
      `;
      return;
    }

    this.dom.allTicketsContainer.innerHTML = tickets.map(t => {
      const cat = store.getCategory(t.categoryId);
      const plat = PLATFORMS[t.platform.toUpperCase()] || PLATFORMS.GENERIC;
      const isYenka = (t.sender || '').toLowerCase().includes('yenka');
      const senderBadgeHtml = isYenka
        ? '<span class="sender-badge sender-badge-yenka">💖 Yenka</span>'
        : '<span class="sender-badge sender-badge-george">🔵 George</span>';

      const avatarHtml = t.thumbnail ? `
        <div class="ticket-row-avatar-wrap">
          <img src="${t.thumbnail}" class="ticket-row-img" alt="" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
          <div class="ticket-row-avatar" style="display:none; background: ${cat.color}22; color: ${cat.color}; border: 1px solid ${cat.color}55;">
            ${plat.iconSvg}
          </div>
        </div>
      ` : `
        <div class="ticket-row-avatar" style="background: ${cat.color}22; color: ${cat.color}; border: 1px solid ${cat.color}55;">
          ${plat.iconSvg}
        </div>
      `;

      return `
        <div class="category-row" style="gap: 0.75rem;">
          ${avatarHtml}
          <div style="flex:1; min-width:0;">
            <div style="font-size:0.85rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${t.title}
            </div>
            <div style="font-size:0.72rem; color: var(--text-muted); display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap; margin-top:2px;">
              <span style="color: ${cat.color}; font-weight:600;">● ${cat.name}</span>
              <span>•</span>
              <span>${plat.name}</span>
              <span>•</span>
              ${senderBadgeHtml}
            </div>
          </div>
          <a href="${t.url}" target="_blank" class="btn btn-glass" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" title="Abrir link original">
            ↗
          </a>
          <button class="btn-delete-category btn-del-tkt" data-id="${t.id}" title="Eliminar boleto">
            ✕
          </button>
        </div>
      `;
    }).join('');

    this.dom.allTicketsContainer.querySelectorAll('.btn-del-tkt').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        store.deleteTicket(id);
        this.renderTicketsList();
        this.showToast('Boleto eliminado.');
      });
    });
  }

  // Sender selection pill highlight
  updateSenderPillSelection() {
    if (!this.dom.senderPillsGroup) return;
    const current = store.activeSender || 'George';
    const pills = this.dom.senderPillsGroup.querySelectorAll('.sender-pill');
    pills.forEach(p => {
      if (p.dataset.sender.toLowerCase() === current.toLowerCase()) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
  }

  // Handle URL parameters from Web Share Target or external shortcuts
  handleIncomingShareParams() {
    try {
      const params = new URLSearchParams(window.location.search);
      const rawUrl = params.get('url') || params.get('text');
      const sender = params.get('sender');

      if (sender) {
        store.setActiveSender(sender);
        this.updateSenderPillSelection();
      }

      if (rawUrl) {
        const urlMatch = rawUrl.match(/https?:\/\/[^\s]+/);
        const targetUrl = urlMatch ? urlMatch[0] : rawUrl;

        if (targetUrl.startsWith('http')) {
          this.dom.urlInput.value = targetUrl;
          this.handleUrlInput(targetUrl);
          this.showToast(`📥 Enlace compartido recibido (${store.activeSender}).`);

          // Clear parameters from browser address bar
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      }
    } catch (e) {
      console.warn('Error parsing incoming share params:', e);
    }
  }

  // Mobile connect & shortcuts modal
  openMobileConnectModal(defaultTab = 'tab-iphone') {
    this.switchMobileTab(defaultTab);
    this.renderMobileShortcutsGuide();
    this.updateFirebaseStatusBanner();
    this.dom.mobileConnectDialog.showModal();
  }

  switchMobileTab(tabId) {
    if (!this.dom.mobileConnectDialog) return;
    const buttons = this.dom.mobileConnectDialog.querySelectorAll('.tab-btn');
    const panes = this.dom.mobileConnectDialog.querySelectorAll('.tab-pane');

    buttons.forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabId);
    });

    panes.forEach(p => {
      p.classList.toggle('active', p.id === tabId);
    });
  }

  renderMobileShortcutsGuide() {
    // 1. iPhone Guide (Yenka)
    const iphoneDetails = shortcutsGuide.getIosShortcutDetails('Yenka');
    if (this.dom.iphoneStepsContainer) {
      this.dom.iphoneStepsContainer.innerHTML = `
        <div style="margin-bottom:0.75rem;">
          <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:0.25rem;">Endpoint REST (para Atajo de iOS):</div>
          <div class="endpoint-display-box">${iphoneDetails.endpoint}</div>
        </div>
        <div>
          ${iphoneDetails.steps.map(s => `
            <div class="guide-step-item">
              <span class="step-num">${s.num}</span>
              <div>${s.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // 2. Android Guide (George)
    const androidDetails = shortcutsGuide.getAndroidShortcutDetails('George');
    if (this.dom.androidStepsContainer) {
      this.dom.androidStepsContainer.innerHTML = `
        <div style="margin-bottom:0.75rem;">
          <div style="font-size:0.8rem; font-weight:700; color:var(--accent-cyan); margin-bottom:0.4rem;">
            Opción 1: Instalar como App PWA (Recomendada y directa)
          </div>
          ${androidDetails.stepsPWA.map(s => `
            <div class="guide-step-item">
              <span class="step-num">${s.num}</span>
              <div>${s.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
            </div>
          `).join('')}
        </div>

        <div style="margin-top:0.9rem; padding-top:0.75rem; border-top:1px solid rgba(255,255,255,0.08);">
          <div style="font-size:0.8rem; font-weight:700; color:#ffd166; margin-bottom:0.4rem;">
            Opción 2: App "HTTP Shortcuts" (Compartir sin salir de Instagram)
          </div>
          <div class="endpoint-display-box">${androidDetails.endpoint}</div>
          ${androidDetails.stepsHttpShortcuts.map(s => `
            <div class="guide-step-item">
              <span class="step-num">${s.num}</span>
              <div>${s.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Fill form if config exists
    if (firebaseSync.config) {
      if (this.dom.fbProjectId) this.dom.fbProjectId.value = firebaseSync.config.projectId || '';
      if (this.dom.fbApiKey) this.dom.fbApiKey.value = firebaseSync.config.apiKey || '';
    }
  }

  setupFirebaseStatusListener() {
    firebaseSync.onStatusChange(({ status, message }) => {
      if (this.dom.cloudStatusDot) {
        this.dom.cloudStatusDot.className = 'cloud-dot ' + (status === 'connected' ? 'connected' : (status === 'error' ? 'error' : ''));
      }
      if (this.dom.cloudStatusText) {
        this.dom.cloudStatusText.textContent = status === 'connected' ? 'Nube 🟢' : (status === 'connecting' ? 'Conectando...' : 'Local');
      }
      this.updateFirebaseStatusBanner();
    });
  }

  updateFirebaseStatusBanner() {
    if (!this.dom.firebaseStatusBanner) return;
    const isConfigured = firebaseSync.isConfigured();
    const status = firebaseSync.status;
    const msg = firebaseSync.statusMessage;

    const color = status === 'connected' ? '#10b981' : (status === 'error' ? '#ef4444' : '#94a3b8');
    const icon = status === 'connected' ? '🟢' : (status === 'error' ? '🔴' : '⚪');

    this.dom.firebaseStatusBanner.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <span style="font-weight:700; color:${color};">${icon} Estado: ${msg}</span>
        ${isConfigured ? '<span style="font-size:0.72rem; color:var(--text-dim);">' + (firebaseSync.config.projectId) + '</span>' : ''}
      </div>
    `;
  }

  setupAmbientBubbles() {
    const ambient = document.getElementById('ocean-ambient');
    if (!ambient) return;

    for (let i = 0; i < 18; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'ocean-bubble';
      const size = 8 + Math.random() * 14;
      const left = Math.random() * 100;
      const drift = -35 + Math.random() * 70;
      const duration = 14 + Math.random() * 16;
      const delay = Math.random() * 12;
      const opacity = 0.4 + Math.random() * 0.4;

      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${left}%`;
      bubble.style.opacity = opacity.toFixed(2);
      bubble.style.setProperty('--bubble-drift', `${drift}px`);
      bubble.style.animationDuration = `${duration}s`;
      bubble.style.animationDelay = `${delay}s`;

      ambient.appendChild(bubble);
    }
  }

  updateSoundToggleState() {
    const isEnabled = store.settings.soundEnabled;
    this.dom.btnAudioToggle.classList.toggle('muted', !isEnabled);
    this.dom.btnAudioToggle.title = isEnabled ? 'Silenciar efectos' : 'Activar sonido';
    this.dom.btnAudioToggle.innerHTML = isEnabled 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
    this.dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastOut 300ms forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
