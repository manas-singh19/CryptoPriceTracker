import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ConnectionStatus = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Connected':
        return '#28a745';
      case 'Connecting...':
        return '#ffc107';
      case 'Disconnected':
        return '#6c757d';
      case 'Error':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'Connected':
        return '●';
      case 'Connecting...':
        return '◐';
      case 'Disconnected':
        return '○';
      case 'Error':
        return '●';
      default:
        return '○';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.icon, { color: getStatusColor() }]}>
        {getStatusIcon()}
      </Text>
      <Text style={[styles.status, { color: getStatusColor() }]}>
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 12,
    marginRight: 6,
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ConnectionStatus;