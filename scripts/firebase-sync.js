/**
 * Pecera Social - Firebase Firestore Cloud Real-time Synchronization
 * Connects webapp with Firestore so tickets submitted from iPhone (iOS Shortcuts),
 * Android (HTTP Shortcuts / PWA) or web input synchronize in real-time across devices.
 */

const FIREBASE_STORAGE_KEY = 'pecera_social_firebase_config_v1';

export class FirebaseSync {
  constructor() {
    this.app = null;
    this.db = null;
    this.unsubscribeSnapshot = null;
    this.status = 'unconfigured'; // 'unconfigured' | 'connecting' | 'connected' | 'error'
    this.statusMessage = 'Modo Local (localStorage activo)';
    this.listeners = new Set();
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(FIREBASE_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.projectId && parsed.apiKey) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Could not read firebase config:', e);
    }
    return null;
  }

  saveConfig(newConfig) {
    if (!newConfig || !newConfig.projectId) {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(FIREBASE_STORAGE_KEY);
      }
      this.config = null;
      this.disconnect();
      return;
    }
    this.config = {
      apiKey: newConfig.apiKey.trim(),
      authDomain: newConfig.authDomain ? newConfig.authDomain.trim() : `${newConfig.projectId.trim()}.firebaseapp.com`,
      projectId: newConfig.projectId.trim(),
      storageBucket: newConfig.storageBucket ? newConfig.storageBucket.trim() : `${newConfig.projectId.trim()}.appspot.com`,
      messagingSenderId: newConfig.messagingSenderId ? newConfig.messagingSenderId.trim() : '',
      appId: newConfig.appId ? newConfig.appId.trim() : ''
    };
    localStorage.setItem(FIREBASE_STORAGE_KEY, JSON.stringify(this.config));
    this.init();
  }

  isConfigured() {
    return Boolean(this.config && this.config.projectId && this.config.apiKey);
  }

  onStatusChange(callback) {
    this.listeners.add(callback);
    callback({ status: this.status, message: this.statusMessage, config: this.config });
    return () => this.listeners.delete(callback);
  }

  notifyStatus(status, message) {
    this.status = status;
    this.statusMessage = message;
    this.listeners.forEach(cb => {
      try { cb({ status: this.status, message: this.statusMessage, config: this.config }); } catch (e) {}
    });
  }

  async init(onTicketsSyncCallback = null) {
    if (onTicketsSyncCallback) {
      this.onTicketsSync = onTicketsSyncCallback;
    }

    if (!this.isConfigured()) {
      this.notifyStatus('unconfigured', 'Modo Local (Sin sincronización en la nube)');
      return false;
    }

    this.notifyStatus('connecting', 'Conectando con Firebase Firestore...');

    try {
      // Dynamically load official Firebase v10 SDK via CDN ES Modules
      const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
      const { 
        getFirestore, 
        collection, 
        onSnapshot, 
        doc, 
        setDoc, 
        deleteDoc, 
        query, 
        orderBy, 
        limit 
      } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

      this.firestoreOps = { doc, setDoc, deleteDoc, collection, query, orderBy, limit };

      const existingApps = getApps();
      this.app = existingApps.length > 0 ? existingApps[0] : initializeApp(this.config);
      this.db = getFirestore(this.app);

      this.setupRealtimeListener(collection, query, orderBy, limit, onSnapshot);
      this.notifyStatus('connected', `Conectado a Firebase (${this.config.projectId})`);
      return true;
    } catch (err) {
      console.error('Firebase initialization error:', err);
      this.notifyStatus('error', `Error de conexión: ${err.message || 'Verifica tus credenciales'}`);
      return false;
    }
  }

  setupRealtimeListener(collection, query, orderBy, limit, onSnapshot) {
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot();
      this.unsubscribeSnapshot = null;
    }

    try {
      const ticketsCol = collection(this.db, 'tickets');
      // Listen to recent 200 tickets
      const q = query(ticketsCol, orderBy('createdAt', 'desc'), limit(200));

      this.unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const cloudTickets = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          cloudTickets.push({
            id: docSnap.id,
            url: data.url || '',
            platform: data.platform || 'generic',
            title: data.title || 'Publicación',
            author: data.author || '',
            thumbnail: data.thumbnail || '',
            mediaType: data.mediaType || 'video',
            categoryId: data.categoryId || 'cat-general',
            sender: data.sender || 'General',
            createdAt: data.createdAt || new Date().toISOString()
          });
        });

        if (this.onTicketsSync) {
          this.onTicketsSync(cloudTickets);
        }
      }, (err) => {
        console.warn('Firestore snapshot error:', err);
        this.notifyStatus('error', `Error en tiempo real: ${err.message}`);
      });
    } catch (e) {
      console.error('Failed to setup Firestore listener:', e);
    }
  }

  async addTicket(ticket) {
    if (!this.db || !this.firestoreOps) return false;
    try {
      const { doc, setDoc } = this.firestoreOps;
      const ticketRef = doc(this.db, 'tickets', ticket.id);
      await setDoc(ticketRef, {
        url: ticket.url,
        platform: ticket.platform || 'generic',
        title: ticket.title || 'Publicación',
        author: ticket.author || '',
        thumbnail: ticket.thumbnail || '',
        mediaType: ticket.mediaType || 'video',
        categoryId: ticket.categoryId || 'cat-general',
        sender: ticket.sender || 'George',
        createdAt: ticket.createdAt || new Date().toISOString()
      });
      return true;
    } catch (e) {
      console.error('Failed to add ticket to Firestore:', e);
      return false;
    }
  }

  async deleteTicket(ticketId) {
    if (!this.db || !this.firestoreOps) return false;
    try {
      const { doc, deleteDoc } = this.firestoreOps;
      await deleteDoc(doc(this.db, 'tickets', ticketId));
      return true;
    } catch (e) {
      console.error('Failed to delete ticket from Firestore:', e);
      return false;
    }
  }

  disconnect() {
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot();
      this.unsubscribeSnapshot = null;
    }
    this.notifyStatus('unconfigured', 'Modo Local (localStorage activo)');
  }

  /**
   * Generates the REST API endpoint and JSON payload for iOS Shortcuts and Android HTTP Shortcuts.
   */
  getRestApiInfo(senderName = 'George') {
    const projectId = this.config ? this.config.projectId : 'TU-PROYECTO-FIREBASE';
    const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/tickets`;
    
    const samplePayload = {
      fields: {
        url: { stringValue: "https://www.instagram.com/reel/ejemplo/" },
        sender: { stringValue: senderName },
        title: { stringValue: `Reel compartido por ${senderName}` },
        platform: { stringValue: "instagram" },
        mediaType: { stringValue: "video" },
        categoryId: { stringValue: "cat-general" },
        createdAt: { stringValue: new Date().toISOString() }
      }
    };

    return {
      endpoint,
      projectId,
      samplePayload,
      curlCommand: `curl -X POST "${endpoint}" -H "Content-Type: application/json" -d '${JSON.stringify(samplePayload)}'`
    };
  }
}

export const firebaseSync = new FirebaseSync();
