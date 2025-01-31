const API_URL = 'https://projectservicecontainer-b6b5efghc2c9hthk.uksouth-01.azurewebsites.net/api/projects';

export const addComment = async (
    projectId: string,
    userId: string,
    firstName: string,
    lastName: string,
    comment: string
  ) => {
    const response = await fetch(`${API_URL}/${projectId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, firstName, lastName, comment }),
    });
  
    if (!response.ok) {
        console.log(`${API_URL}/${projectId}/comment`);
      throw new Error('Failed to add comment');
    }
  
    return await response.json();
  };
  