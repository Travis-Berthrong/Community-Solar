// app/addproject.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import CreateProjectForm from '@/components/CreateProjectForm';
import ProjectForecast from '@/components/ProjectForecast';

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