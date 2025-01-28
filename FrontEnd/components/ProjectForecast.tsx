// components/ProjectForecast.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, ScrollView, useColorScheme } from 'react-native';
import { getStyles } from '@/styles/addprojectStyles';
import { IProject } from '@/types/IProject';
import { IProjectInfo } from '@/types/IProjectInfo';
import { useRouter } from 'expo-router';

interface ProjectMetrics {
  projectCost: number;
  estimatedElectricityOutput: number;
  estimatedCO2Savings: number;
  estimatedRevenue: number;
  estimatedROI: number;
}

interface ProjectForecastProps {
  projectInfo: IProjectInfo;
  onBack: () => void;
}

const ProjectForecast: React.FC<ProjectForecastProps> = ({ projectInfo, onBack }) => {
  const [metrics, setMetrics] = useState<ProjectMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);

  useEffect(() => {
    fetchProjectMetrics();
  }, []);

  const fetchProjectMetrics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/projects/forecast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectLat: projectInfo.latitude,
          projectLong: projectInfo.longitude,
          projectArea: projectInfo.landSize,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project metrics');
      }

      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
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

  const handleProjectCreation = async () => {
    if (!metrics) {
      return;
    }
    const projectData: IProject = {
      title: projectInfo.title,
      description: projectInfo.description,
      address: projectInfo.address,
      latitude: projectInfo.latitude,
      longitude: projectInfo.longitude,
      landSize: projectInfo.landSize,
      fundingGoal: metrics.projectCost,
      fundingCurrent: 0,
      estimatedElectricityOutput: metrics.estimatedElectricityOutput,
      estimatedCO2Savings: metrics.estimatedCO2Savings,
      estimatedRevenue: metrics.estimatedRevenue,
      estimatedROI: metrics.estimatedROI,
      owner: {
        userId: '123',
        firstName: 'John',
        lastName: 'Doe',
      },
      investors: [],
      comments: [],
    };

    try {
      const response = await fetch('http://localhost:8080/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      alert('Project created successfully');
      router.push('/home');

    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
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
          <Button title='Create Project'
           onPress={handleProjectCreation}
           color={isDarkMode ? '#4CAF50' : '#1E90FF'}
           />
        </>
      )}
    </ScrollView>
  );
};



export default ProjectForecast;