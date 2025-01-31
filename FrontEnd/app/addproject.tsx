// app/addproject.tsx
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Dimensions, StyleSheet } from 'react-native';
import CreateProjectForm from '@/components/CreateProjectForm';
import ProjectForecast from '@/components/ProjectForecast';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderTitle } from '@/components/HeaderTitle';

const { width } = Dimensions.get('window');


interface ProjectInfo {
  title: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  landSize: number;
}

export default function AddProjectPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [projectData, setProjectData] = useState<ProjectInfo | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle headerText="Propose Your Project !" />,
      headerTitleAlign: 'center', // Ensures title is centered
      headerStyle: styles.header,
      headerLeft: () => (
        <View style={styles.headerLeftContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const handleProjectDataSubmit = (data: ProjectInfo) => {
    setProjectData(data);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <View style={{ flex: 1 }}>
      {step === 1 ? (
        <CreateProjectForm 
          onSubmit={handleProjectDataSubmit}
          initialData={projectData}
        />
      ) : (
        <ProjectForecast 
          projectInfo={projectData!}
          onBack={handleBack}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2E7D32',
  },
  headerLeftContainer: {
    position: 'absolute',
    left: width * 0.15, // Position the back button halfway between the left edge and the title
    zIndex: 1, // Ensure it's above other elements
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
});