import { IAddInvestor } from "@/types/IAddInvestor";


export const handleAddInvestorRequest = async (addInvestorForm: IAddInvestor, id: string) => {
    try {
      const requestData = JSON.stringify(addInvestorForm);
      console.log('Add Investor Request:', requestData);
      const response = await fetch(`https://projectservicecontainer-b6b5efghc2c9hthk.uksouth-01.azurewebsites.net/api/projects/${id}/investor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestData,
      });
      console.log('Add Investor Response:', response);
      if (!response.ok) {
        throw new Error('Failed to add investor');
      }

    } catch (error) {
      console.error('Error adding investor:', error);
    }
  };