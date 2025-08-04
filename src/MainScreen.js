import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  AppState,
  Platform,
} from 'react-native';
import { useAnimatedUpdate } from './hooks/useAnimatedUpdate';
import PriceCard from './components/PriceCard';
import ConnectionStatus from './components/ConnectionStatus';
import PriceChart from './components/PriceChart';
import ErrorBoundary from './components/ErrorBoundary';
import WebSocketService from './services/WebSocketService';

const MainScren = () => {
  const [priceData, setPriceData] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [showChart, setShowChart] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [chartData, setChartData] = useState([]);
  const wsService = useRef(null);
  const connectionStats = useRef({});
  const appState = useRef(AppState.currentState);

  // Cryptocurrency symbols to track
  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'DOTUSDT'];

  // Initialize empty chart data for all symbols
  useEffect(() => {
    setChartData(symbols.map(symbol => ({
      symbol,
      prices: []
    })));
  }, []);

  useEffect(() => {
    // Initialize WebSocket service
    wsService.current = new WebSocketService(symbols);
    
    // Set up handlers
    wsService.current.setHandlers({
      onMessage: (data) => {
        updatePriceData(data);
        updateChartData(data);
      },
      onConnectionChange: (status) => {
        setConnectionStatus(status);
        if (status === 'Error') {
          Alert.alert('Connection Error', 'Failed to connect to price feed');
        }
      },
      onError: (error) => {
        console.error('WebSocket Error:', error);
      }
    });

    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to foreground
        wsService.current.connect();
      } else if (nextAppState.match(/inactive|background/)) {
        // App has gone to background
        wsService.current.disconnect();
      }
      appState.current = nextAppState;
    };

    // Subscribe to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Initial connection
    wsService.current.connect();

    // Start stats monitoring
    const statsInterval = setInterval(() => {
      connectionStats.current = wsService.current.getConnectionStats();
    }, 5000);

    // Cleanup function
    return () => {
      subscription.remove();
      clearInterval(statsInterval);
      if (wsService.current) {
        wsService.current.disconnect();
      }
    };
  }, []);

  const reconnectWebSocket = () => {
    if (wsService.current) {
      wsService.current.connect();
    }
  };

  const updatePriceData = (newData) => {
    const timestamp = new Date().toLocaleTimeString();
    
    setPriceData(prevData => {
      const existingIndex = prevData.findIndex(item => item.symbol === newData.s);
      
      const newItem = {
        symbol: newData.s,
        price: parseFloat(newData.c),
        change: parseFloat(newData.p),
        changePercent: parseFloat(newData.P),
        timestamp: timestamp,
        high: parseFloat(newData.h),
        low: parseFloat(newData.l),
        volume: parseFloat(newData.v),
      };

      if (existingIndex >= 0) {
        const updatedData = [...prevData];
        updatedData[existingIndex] = newItem;
        return updatedData;
      } else {
        return [...prevData, newItem];
      }
    });
  };

  const processChartUpdate = useCallback((batchedUpdates) => {
    if (!batchedUpdates.length) return;

    setChartData(prevData => {
      const updates = new Map();
      
      // Process all updates in the batch
      batchedUpdates.forEach(newData => {
        const price = parseFloat(newData.c);
        const timestamp = Date.now();
        const symbol = newData.s;

        if (!updates.has(symbol)) {
          updates.set(symbol, []);
        }
        updates.get(symbol).push({ price, timestamp });
      });

      return prevData.map(item => {
        const symbolUpdates = updates.get(item.symbol);
        if (!symbolUpdates) return item;

        // Only process if it's the selected symbol or we don't have data yet
        if (selectedSymbol && item.symbol !== selectedSymbol) {
          return item;
        }

        const lastPoint = item.prices[item.prices.length - 1];
        let newPoints = [];

        symbolUpdates.forEach(({ price, timestamp }) => {
          if (lastPoint) {
            const timeDiff = timestamp - lastPoint.x;
            const priceDiff = price - lastPoint.y;
            
            // Add high-resolution interpolation points
            const steps = Math.min(4, Math.max(1, Math.floor(timeDiff / 250)));
            for (let i = 1; i <= steps; i++) {
              const progress = i / (steps + 1);
              // Use cubic bezier interpolation for smoother transitions
              const smoothProgress = progress * progress * (3 - 2 * progress);
              const interpolatedTime = lastPoint.x + (timeDiff * smoothProgress);
              const interpolatedPrice = lastPoint.y + (priceDiff * smoothProgress);
              newPoints.push({ x: interpolatedTime, y: interpolatedPrice });
            }
          }
          newPoints.push({ x: timestamp, y: price });
        });

        const updatedPrices = [...item.prices, ...newPoints].slice(-60); // Increased points for smoother line
        return { ...item, prices: updatedPrices };
      });
    });
  }, [selectedSymbol]);

  const updateChartData = useAnimatedUpdate(processChartUpdate, Platform.OS === 'ios' ? 16 : 32);

const renderPriceItem = useCallback(({ item }) => (
  <PriceCard
    data={item}
    isSelected={selectedSymbol === item.symbol && showChart}
    onPress={() => {
      if (selectedSymbol === item.symbol && showChart) {
        setShowChart(false);
        setSelectedSymbol(null);
      } else {
        setSelectedSymbol(item.symbol);
        setShowChart(true);
      }
    }}
  />
), [selectedSymbol, showChart]);

const getItemLayout = useCallback((data, index) => ({
  length: 100, // Fixed height of each item
  offset: 100 * index,
  index,
}), []);  const keyExtractor = (item) => item.symbol;

  if (priceData.length === 0 && connectionStatus === 'Connecting...') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Connecting to price feed...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Crypto Price Tracker</Text>
        <ConnectionStatus status={connectionStatus} />
      </View>

      {showChart && selectedSymbol && (
        <>
          {console.log('Selected Symbol:', selectedSymbol, 'Chart Data:', chartData)}
          <PriceChart 
            data={chartData.find(item => item.symbol === selectedSymbol)} 
            onClose={() => {
              setShowChart(false);
              setSelectedSymbol(null);
            }}
          />
        </>
      )}

      <FlatList
        data={priceData}
        renderItem={renderPriceItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={false}
        onRefresh={reconnectWebSocket}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  listContainer: {
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6c757d',
  },
});

export default MainScren;