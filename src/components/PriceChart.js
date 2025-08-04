import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const PriceChart = React.memo(({ data, onClose }) => {
  console.log('Chart Data Received:', data);
  if (!data || !data.prices || data.prices.length < 2) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{data?.symbol || 'Chart'}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Collecting data...</Text>
        </View>
      </View>
    );
  }

  const prices = data.prices.map(point => point.y);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const chartData = useMemo(() => ({
    labels: data.prices.map((_, index) => index % 10 === 0 ? '' : ''),
    datasets: [{
      data: prices,
      color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
      strokeWidth: 2,
    }],
  }), [data.prices, prices]);

  const renderChart = useMemo(() => {
    const config = {
      backgroundColor: '#ffffff',
      backgroundGradientFrom: '#ffffff',
      backgroundGradientTo: '#ffffff',
      decimalPlaces: 6,
      color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(108, 117, 125, ${opacity})`,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: "0",
      },
      propsForBackgroundLines: {
        strokeDasharray: "",
        stroke: '#e9ecef',
        strokeWidth: 1,
      },
      strokeWidth: 2,
      useShadowColorFromDataset: false,
       
    };

    return (
      <LineChart
        data={chartData}
        width={screenWidth - 55}
        height={200}
        chartConfig={config}
        bezier
        style={styles.chart}
        withInnerLines={false}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        withShadow={false}
        withDots={false}
        animate={true}
        animationDuration={300}
      />
    );
  }, [chartData]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{data.symbol}</Text>
        <View style={styles.headerRight}>
          <View style={styles.priceInfo}>
            <Text style={styles.currentPrice}>
              ${prices[prices.length - 1]?.toFixed(6)}
            </Text>
            <Text style={styles.priceRange}>
              Range: ${minPrice.toFixed(6)} - ${maxPrice.toFixed(6)}
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
      {renderChart}
      <Text style={styles.timeLabel}>Real-time price updates (last 60 points)</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  priceInfo: {
    marginRight: 10,
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  priceRange: {
    fontSize: 12,
    color: '#6c757d',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6c757d',
    lineHeight: 24,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#6c757d',
  },
  timeLabel: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default PriceChart;