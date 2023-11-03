import axios from 'axios';
import { CircleData } from '@/interfaces/CircleIF';

async function fetchData(index: number): Promise<Array<CircleData>> {
  let fetchedData: Array<CircleData> = [];
  try {
    const fileName: string = 'data' + index;
    const response = await axios.get('http://localhost:3000/data?name=' + fileName);
    if (response.status === 200) {
      console.log('Loaded', response.data.data, 'from', fileName);
      fetchedData = response.data.data;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  console.log('inner', fetchedData);
  return fetchedData;
}

async function updateData(index: number, data: Array<CircleData>): Promise<void> {
  const targetName: string = 'data' + index;
  const dataToUpdate = {
    name: targetName,
    updates: {
      data: data
    }
  }
  try {
    // Make the PATCH request using async/await
    const response = await axios.patch('http://localhost:3000/data', dataToUpdate);
    console.log('Update successful:', response.data);
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

const DB = {
  fetchData,
  updateData
};

export default DB;