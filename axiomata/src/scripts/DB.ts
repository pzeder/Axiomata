import axios from 'axios';

async function fetchData(): Promise<any> {
  let fetchedData: any;
  try {
    const response = await axios.get('http://localhost:3000/courses');
    if (response.status === 200) {
      fetchedData = response.data;
      console.log(fetchedData);
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  return fetchedData;
}

const DB = {
  fetchData,
};

export default DB;