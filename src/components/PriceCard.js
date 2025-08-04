import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

const PriceCard = memo(({ data, onPress, isSelected }) => {
  const {
    symbol,
    price,
    change,
    changePercent,
    timestamp,
    high,
    low,
    volume,
  } = data;

  const isPositive = change >= 0;
  const changeColor = isPositive ? '#28a745' : '#dc3545';
  const changeIcon = isPositive ? '↑' : '↓';

  const formatPrice = (value) => {
    if (value >= 1) {
      return value.toFixed(2);
    } else {
      return value.toFixed(6);
    }
  };

  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toFixed(0);
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        isSelected && styles.selectedCard
      ]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{symbol}</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${formatPrice(price)}</Text>
          <View style={[styles.changeContainer, { backgroundColor: changeColor + '20' }]}>
            <Text style={[styles.changeIcon, { color: changeColor }]}>
              {changeIcon}
            </Text>
            <Text style={[styles.change, { color: changeColor }]}>
              {Math.abs(changePercent).toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>24h High</Text>
          <Text style={styles.statValue}>${formatPrice(high)}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>24h Low</Text>
          <Text style={styles.statValue}>${formatPrice(low)}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Volume</Text>
          <Text style={styles.statValue}>{formatVolume(volume)}</Text>
        </View>
      </View>

      <View style={styles.changeDetailContainer}>
        <Text style={[styles.changeDetail, { color: changeColor }]}>
          {isPositive ? '+' : ''}${Math.abs(change).toFixed(6)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
        </Text>
        {isSelected && (
          <Text style={styles.tapHint}>Tap again to close chart</Text>
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
    backgroundColor: '#f8f9ff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  symbolContainer: {
    flex: 1,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#6c757d',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  changeIcon: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  change: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#6c757d',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#212529',
  },
  changeDetailContainer: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  changeDetail: {
    fontSize: 13,
    fontWeight: '600',
  },
  tapHint: {
    fontSize: 11,
    color: '#007AFF',
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default PriceCard;