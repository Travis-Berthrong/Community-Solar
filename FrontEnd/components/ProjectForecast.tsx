import React from 'react';
import { View, Text, Button, useColorScheme } from 'react-native';
import { getStyles } from '@/styles/addprojectStyles';

interface ProjectInfo {
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  landSize: number;
}

interface ProjectForecastProps {
  projectInfo: ProjectInfo;
  onBack: () => void;
}

const ProjectForecast: React.FC<ProjectForecastProps> = ({ projectInfo, onBack }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <Button 
        title="Back to Project Details" 
        onPress={onBack}
        color={isDarkMode ? '#4CAF50' : '#1E90FF'}
      />
      
      {/* Your forecast UI using projectInfo */}
      <Text style={styles.label}>Project Title: {projectInfo.title}</Text>
      <Text style={styles.label}>Location: {projectInfo.address}</Text>
      <Text style={styles.label}>Land Size: {projectInfo.landSize} sq meters</Text>
      
      {/* Add your forecast calculations and displays here */}
    </View>
  );
};

export default ProjectForecast;