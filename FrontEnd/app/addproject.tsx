// app/addproject.tsx
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import CreateProjectForm from '@/components/CreateProjectForm';
import ProjectForecast from '@/components/ProjectForecast';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { ScreenStackHeaderLeftView } from 'react-native-screens';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderTitle } from '@/components/HeaderTitle';

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
      headerLeft: () => (
        <ScreenStackHeaderLeftView>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 40 }}>
            <Ionicons name="chevron-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </ScreenStackHeaderLeftView>
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