import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, StyleSheet, Animated, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useColorScheme } from 'react-native';
import { getStyles } from '@/styles/addprojectStyles';
import { useRouter } from 'expo-router';

interface ProjectMetrics {
  projectCost: number;
  estimatedElectricityOutput: number;
  estimatedCO2Savings: number;
  estimatedRevenue: number;
  estimatedROI: number;
}

interface ProjectForecastProps {
  projectInfo: any;
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

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    fetchProjectMetrics();
  }, []);

  const fetchProjectMetrics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://projectservicecontainer-b6b5efghc2c9hthk.uksouth-01.azurewebsites.net/api/projects/forecast', {
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
    }).format(amount);
  };

  const formatNumber = (number: number, suffix: string = '') => {
    return `${number.toLocaleString()}${suffix}`;
  };

  const handleProjectCreation = async () => {
    if (!metrics) return;

    try {
      const requestBody = JSON.stringify({
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
          firstName: 'John',
          lastName: 'Doe',
          userId: '12345',
        },
        investors: [],
        comments: [],
      });
      console.log('Request Body:', requestBody);
      const response = await fetch('https://projectservicecontainer-b6b5efghc2c9hthk.uksouth-01.azurewebsites.net/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });
      console.log('Response:', response);
      console.log('Response JSON:', await response.json());

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      setShowSuccessModal(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Automatically close after 2 seconds and navigate home
      setTimeout(() => {
        setShowSuccessModal(false);
        router.push('/home');
      }, 2000);
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
        <TouchableOpacity onPress={fetchProjectMetrics} style={buttonStyles.retryButton}>
          <Text style={buttonStyles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={modalStyles.overlay}>
          <Animated.View style={[modalStyles.modalContainer, { opacity: fadeAnim }]}>
            <Ionicons name="checkmark-circle-outline" size={50} color="green" />
            <Text style={modalStyles.successText}>Project Created Successfully!</Text>
          </Animated.View>
        </View>
      </Modal>
      <View style={styles.card}>
        {/* Back Button */}
        <TouchableOpacity onPress={onBack} style={buttonStyles.backButton}>
          <Ionicons name="arrow-back" size={24} color="green" />
        </TouchableOpacity>

        {/* Project Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="briefcase-outline" size={20} color="green" /> Project Overview
          </Text>
          <Text style={styles.label}>Title: {projectInfo.title}</Text>
          <Text style={styles.label}>Location: {projectInfo.address}</Text>
          <Text style={styles.label}>Land Size: {formatNumber(projectInfo.landSize, ' sq meters')}</Text>
        </View>

        {/* Financial Metrics */}
        {metrics && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="cash-outline" size={20} color="green" /> Financial Metrics
              </Text>
              <Text style={styles.label}>Project Cost: {formatCurrency(metrics.projectCost)}</Text>
              <Text style={styles.label}>Estimated Revenue: {formatCurrency(metrics.estimatedRevenue)}</Text>
              <Text style={styles.label}>ROI: {formatNumber(metrics.estimatedROI, '%')}</Text>
            </View>

            {/* Environmental Impact */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="leaf-outline" size={20} color="green" /> Environmental Impact
              </Text>
              <Text style={styles.label}>
                Electricity Output: {formatNumber(metrics.estimatedElectricityOutput, ' kWh')}
              </Text>
              <Text style={styles.label}>
                CO2 Savings: {formatNumber(metrics.estimatedCO2Savings, ' tons')}
              </Text>
            </View>

            {/* Create Project Button */}
            <TouchableOpacity onPress={handleProjectCreation} style={buttonStyles.createProjectButton}>
              <Text style={buttonStyles.buttonText}>Create Project</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const buttonStyles = StyleSheet.create({
  backButton: {
    padding: 10,
    alignSelf: 'flex-start',
  },
  createProjectButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  retryButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
  },
  successText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    marginTop: 10,
  },
});

export default ProjectForecast;
