class WebSocketService {
  constructor(symbols) {
    this.symbols = symbols;
    this.ws = null;
    this.connectionAttempts = 0;
    this.maxRetries = 5;
    this.baseDelay = 1000; // Start with 1 second delay
    this.heartbeatInterval = null;
    this.connectionTimeout = null;
    this.lastMessageTime = null;
    this.stats = {
      messagesReceived: 0,
      errors: 0,
      reconnections: 0,
      lastConnectedAt: null,
      uptime: 0,
    };
    this.handlers = {
      onMessage: () => {},
      onConnectionChange: () => {},
      onError: () => {},
    };
  }

  setHandlers({ onMessage, onConnectionChange, onError }) {
    this.handlers = {
      onMessage: onMessage || this.handlers.onMessage,
      onConnectionChange: onConnectionChange || this.handlers.onConnectionChange,
      onError: onError || this.handlers.onError,
    };
  }

  connect() {
    try {
      this.handlers.onConnectionChange('Connecting...');
      
      const streamNames = this.symbols.map(symbol => `${symbol.toLowerCase()}@ticker`).join('/');
      this.ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamNames}`);

      // Set connection timeout
      this.connectionTimeout = setTimeout(() => {
        if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
          this.reconnect('Connection timeout');
        }
      }, 10000);

      this.ws.onopen = () => {
        console.log('WebSocket Connected');
        this.connectionAttempts = 0;
        this.stats.lastConnectedAt = Date.now();
        this.stats.reconnections++;
        this.startHeartbeat();
        clearTimeout(this.connectionTimeout);
        this.handlers.onConnectionChange('Connected');
      };

      this.ws.onmessage = (event) => {
        try {
          this.lastMessageTime = Date.now();
          this.stats.messagesReceived++;
          const data = JSON.parse(event.data);
          this.handlers.onMessage(data);
        } catch (error) {
          this.stats.errors++;
          console.error('Error parsing WebSocket data:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
        this.stats.errors++;
        this.handlers.onError(error);
        this.handlers.onConnectionChange('Error');
      };

      this.ws.onclose = () => {
        console.log('WebSocket Disconnected');
        this.cleanup();
        this.reconnect('Connection closed');
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.stats.errors++;
      this.handlers.onConnectionChange('Error');
      this.reconnect('Connection creation failed');
    }
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (!this.lastMessageTime || Date.now() - this.lastMessageTime > 10000) {
        // No message received in last 10 seconds
        console.log('No heartbeat detected');
        this.reconnect('Heartbeat timeout');
      }
      
      // Update uptime
      if (this.stats.lastConnectedAt) {
        this.stats.uptime = Math.floor((Date.now() - this.stats.lastConnectedAt) / 1000);
      }
    }, 5000);
  }

  reconnect(reason) {
    if (this.connectionAttempts >= this.maxRetries) {
      this.handlers.onConnectionChange('Failed');
      console.error('Max reconnection attempts reached');
      return;
    }

    this.cleanup();
    
    // Exponential backoff with jitter
    const delay = Math.min(
      this.baseDelay * Math.pow(2, this.connectionAttempts) + Math.random() * 1000,
      30000 // Max 30 second delay
    );
    
    this.connectionAttempts++;
    console.log(`Reconnecting in ${delay}ms. Attempt ${this.connectionAttempts}. Reason: ${reason}`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  cleanup() {
    this.handlers.onConnectionChange('Disconnected');
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.lastMessageTime = null;
  }

  getConnectionStats() {
    return {
      ...this.stats,
      currentAttempt: this.connectionAttempts,
      status: this.ws ? this.ws.readyState : 'CLOSED',
    };
  }

  disconnect() {
    this.connectionAttempts = this.maxRetries; // Prevent reconnection
    this.cleanup();
  }
}

export default WebSocketService;
