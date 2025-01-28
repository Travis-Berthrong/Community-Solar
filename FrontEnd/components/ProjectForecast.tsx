// components/ProjectForecast.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, ScrollView, useColorScheme } from 'react-native';
import { getStyles } from '@/styles/addprojectStyles';

interface ProjectInfo {
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  landSize: number;
}

interface ProjectMetrics {
  projectCost: number;
  estimatedElectricityOutput: number;
  estimatedCO2Savings: number;
  estimatedRevenue: number;
  estimatedROI: number;
}

interface ProjectForecastProps {
  projectInfo: ProjectInfo;
  onBack: () => void;
}

const ProjectForecast: React.FC<ProjectForecastProps> = ({ projectInfo, onBack }) => {
  const [metrics, setMetrics] = useState<ProjectMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);

  useEffect(() => {
    fetchProjectMetrics();
  }, []);

  const fetchProjectMetrics = async () => {
    setIsLoading(true);
    setError(null);
    const testData = {
      projectCost: 1000000,
      estimatedElectricityOutput: 100000,
      estimatedCO2Savings: 50,
      estimatedRevenue: 2000000,
      estimatedROI: 100,
    };
    setMetrics(testData);
    setIsLoading(false);

    // try {
    //   const response = await fetch('YOUR_API_ENDPOINT', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(projectInfo),
    //   });

    //   if (!response.ok) {
    //     throw new Error('Failed to fetch project metrics');
    //   }

    //   const data = await response.json();
    //   setMetrics(data);
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : 'An error occurred');
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (number: number, suffix: string = '') => {
    return `${number.toLocaleString()}${suffix}`;
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#4CAF50' : '#1E90FF'} />
        <Text style={[styles.text, { marginTop: 10 }]}>Calculating project metrics...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={[styles.text, styles.errorText]}>{error}</Text>
        <Button
          title="Try Again"
          onPress={fetchProjectMetrics}
          color={isDarkMode ? '#4CAF50' : '#1E90FF'}
        />
        <Button
          title="Back to Project Details"
          onPress={onBack}
          color={isDarkMode ? '#4CAF50' : '#1E90FF'}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Button
        title="Back to Project Details"
        onPress={onBack}
        color={isDarkMode ? '#4CAF50' : '#1E90FF'}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Overview</Text>
        <Text style={styles.label}>Title: {projectInfo.title}</Text>
        <Text style={styles.label}>Location: {projectInfo.address}</Text>
        <Text style={styles.label}>Land Size: {formatNumber(projectInfo.landSize, ' sq meters')}</Text>
      </View>

      {metrics && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Financial Metrics</Text>
            <Text style={styles.label}>Project Cost: {formatCurrency(metrics.projectCost)}</Text>
            <Text style={styles.label}>Estimated Revenue: {formatCurrency(metrics.estimatedRevenue)}</Text>
            <Text style={styles.label}>ROI: {formatNumber(metrics.estimatedROI, '%')}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Environmental Impact</Text>
            <Text style={styles.label}>
              Electricity Output: {formatNumber(metrics.estimatedElectricityOutput, ' kWh')}
            </Text>
            <Text style={styles.label}>
              CO2 Savings: {formatNumber(metrics.estimatedCO2Savings, ' tons')}
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

// Add these styles to your existing styles file


export default ProjectForecast;