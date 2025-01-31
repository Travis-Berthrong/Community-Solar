import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Dimensions, Platform, Animated, Modal, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { IProjectResponse } from '@/types/IProject';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Ionicons } from '@expo/vector-icons';
import { getToken } from '@/services/auth';
import { addComment } from '@/services/comment';
import { handleAddInvestorRequest } from '@/services/investors';
import { IAddInvestor } from '@/types/IAddInvestor';

interface IComment {
    _id?: number;
    userId: string;
    firstName: string;
    lastName: string;
    comment: string;
}



const { width } = Dimensions.get('window');

export default function ProjectPage() {
  const [project, setProject] = useState<IProjectResponse | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [userInfo, setUserInfo] = useState({
      userId: '',
      firstName: '',
      lastName: '',
  });
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [investorModalFormVisible, setInvestorModalFormVisible] = useState(false);
  const [addInvestorForm, setAddInvestorForm] = useState<IAddInvestor>({
    investorId: '',
    investorFirstName: '',
    investorLastName: '',
    investedAmount: 0,
  });
  

  useEffect(() => {
    fetchProjectData();
    fetchCurrentUserInfo();
  }, [id]);

  async function fetchProjectData() {
    try {
      const response = await fetch(`https://projectservicecontainer-b6b5efghc2c9hthk.uksouth-01.azurewebsites.net/api/projects/${id}`);
      const data: IProjectResponse = await response.json();
      setProject(data);
      setComments((data.comments as IComment[]) || []);
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  }
    const fetchCurrentUserInfo = async () => {
      try {
        const userToken = await getToken();
        console.log('User Token:', userToken);
        if (!userToken) {
          throw new Error('User token not found');
        }
        const response = await fetch('https://authservice-enbjagg9d6enh5gg.uksouth-01.azurewebsites.net/api/User/me', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        console.log('User Info Response:', response);
        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }
        const data = await response.json();
        console.log('User Info:', data);
        setUserInfo({
          userId: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
        })
        setAddInvestorForm({
          investorId: data.id,
          investorFirstName: data.firstName,
          investorLastName: data.lastName,
        });
      } catch (error) {
        console.error('Error fetching user info:', error);
        setUserInfo({
          firstName: 'John',
          lastName: 'Doe',
          userId: '12345',
        })
      }
      const data = await response.json();
      console.log('User Info:', data);
      setUserInfo({
        userId: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
      })
    } catch (error) {
      console.error('Error fetching user info:', error);
      setUserInfo({
        firstName: 'John',
        lastName: 'Doe',
        userId: '12345',
      })
    }
  };

  const handleSubmitMessage = async () => {
    if (newMessage.trim()) {
      try {
        const comment = {
          userId: userInfo.userId,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          comment: newMessage,
          commentDate: new Date(),
        };

        // Call the addComment API
        await addComment(id as string, userInfo.userId, userInfo.firstName, userInfo.lastName, newMessage);

        // Update the local state with the new comment
        setComments([...comments, comment]);
        setNewMessage('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
  const handleAddInvestor = async () => {
    try {
      await handleAddInvestorRequest(addInvestorForm, id as string);

      fetchProjectData();
      setInvestorModalFormVisible(false);
      setAddInvestorForm({ ...addInvestorForm, investedAmount: 0 });
    } catch (error) {
      console.error('Error adding investor:', error);
    }
  };
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleInvestorModalForm = () => {
    setInvestorModalFormVisible(!investorModalFormVisible);
  };

  if (!project) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  const fundingProgress = (project.fundingCurrent / project.fundingGoal) * 100;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: () => (""),
          headerLeft: () => (
            <View style={styles.headerLeftContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="chevron-back" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>{project.title}</Text>
        <Text style={styles.author}>Proposed by {project.owner.firstName} {project.owner.lastName}</Text>
      </View>
        <View style={styles.cardsContainer}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={investorModalFormVisible}
            onRequestClose={() => {
              setInvestorModalFormVisible(!investorModalFormVisible);
            }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Card style={{ ...styles.card, width: width > 768 ? '30%' : '90%', height: '20%'}}>
                <Pressable style={{ position: 'absolute', top: 8, right: 8 }} onPress={toggleInvestorModalForm}>
                  <Ionicons name="close" size={24} color="red" />
                </Pressable>
                <Text style={styles.cardTitle}>Add Investment</Text>
                <TextInput
                  value={addInvestorForm?.investedAmount?.toString() ?? ''}
                  onChangeText={(text) => {
                    const cleanedText = text.replace(/[^\d.]/g, '');
                    setAddInvestorForm({ 
                      ...addInvestorForm, 
                      investedAmount: parseFloat(cleanedText) || 0 
                    });
                  }}
                  placeholder="Investment Amount"
                  keyboardType='numeric'
                  style={[styles.input, styles.investmentInput, {
                    textAlign: 'left',
                    paddingHorizontal: 12,
                    height: 40,
                    maxHeight: 40
                  }]}
                />
                <Button onPress={handleAddInvestor} style={[styles.button, { backgroundColor: 'green', marginTop: 20 }]}>
                  <Ionicons name="add" size={16} color="#fff" />
                  <Text style={styles.buttonText}>Add Investment</Text>
                </Button>
              </Card>
              </View>
            </Modal>
        <Card style={{ ...styles.card, width: width > 768 ? '55%' : '90%'}}>
            <Text style={styles.cardTitle}>Project Description</Text>
            <Text style={styles.description}>{project.description}</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                  <Ionicons name="location-outline" size={16} color="green" />
                  <Text style={styles.infoText}>{project.address}</Text>
              </View>
              <View style={styles.infoItem}>
                  <Ionicons name="map-outline" size={16} color="green" />
                  <Text style={styles.infoText}>Land Area: {project.landSize} m²</Text>
              </View>
              <View style={styles.infoItem}>
                  <Ionicons name="trending-up-outline" size={16} color="green" />
                  <Text style={styles.infoText}>ROI: {project.estimatedROI} %</Text>
              </View>
              <View style={styles.infoItem}>
                  <Ionicons name="flash-outline" size={16} color="green" />
                  <Text style={styles.infoText}>Output: {project.estimatedElectricityOutput}</Text>
              </View>
            </View>
        </Card>

        <Card style={{ ...styles.card, width: width > 768 ? '35%' : '90%'}}>
            <Text style={styles.cardTitle}>Funding Progress</Text>
            <Progress value={fundingProgress} style={styles.progress} />
            <Text style={styles.fundingText}>
              ${project.fundingCurrent.toLocaleString()} raised of ${project.fundingGoal.toLocaleString()} goal
            </Text>
            <View style={styles.buttonGroup}>
            <Button onPress={() => {}} style={[styles.button, { backgroundColor: 'green' }]}>
                <Ionicons name="people-outline" size={16} color="#fff" />
                <Text style={styles.buttonText}>{project.investors.length} Investors</Text>
            </Button>
            <Button onPress={toggleInvestorModalForm} style={[styles.button, { backgroundColor: 'green' }]}>
                <Ionicons name="cash-outline" size={16} color="#fff" />
                <Text style={styles.buttonText}>Donate Now</Text>
            </Button>
            <Button onPress={toggleFavorite} style={[styles.button, { backgroundColor: 'green' }]}>
                <Ionicons name="heart" size={16} color={isFavorite ? "#ff0000" : "#fff"} />
                <Text style={styles.buttonText}>{isFavorite ? "Favorited" : "Add to Favorites"}</Text>
            </Button>
            </View>
        </Card>
      </View>

      <Card style={{ ...styles.card, width: '92%', marginHorizontal: 16 }}>
        <Text style={styles.cardTitle}>Comment Forum</Text>
        <Text style={styles.cardSubtitle}>Join the conversation about this project</Text>
        {comments.map((comment) => (
          <View key={comment._id} style={styles.commentItem}>
            <View style={styles.messageContent}>
              <Text style={styles.userName}>{comment.firstName} {comment.lastName}</Text>
              <Text style={styles.message}>{comment.comment}</Text>
            </View>
          </View>
        ))}
        <View style={styles.messageInput}>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your message here."
            style={styles.input}
          />
          <TouchableOpacity onPress={handleSubmitMessage} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerLeftContainer: {
      position: 'absolute',
      left: width * 0.15, 
      zIndex: 1, 
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
  },
  progress: {
    marginVertical: 8,
  },
  fundingText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: 'column',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    padding: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  messageContent: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
  },
  messageInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  sendButton: {
    padding: 8,
  },
  cardsContainer: {
    flexDirection: width > 768 ? 'row' : 'column',
    justifyContent: 'flex-start', // Aligns items to the start (left)
    alignItems: 'flex-start', // Ensures alignment with comments card
  },
  investmentInput: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    borderColor: '#4CAF50', // Green border to match the theme
    borderWidth: 1.5,
    paddingVertical: 10,
    borderRadius: 8,
  },
  
});
