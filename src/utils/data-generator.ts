// Generate dummy data over 3 years with daily intervals
export const generateRandomStockData = (numPoints: number) => {
  const startDate = new Date();
  const data = [];

  // Generate random data
  for (let i = 0; i < numPoints; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000); // Increment by one day
    const price = Math.random() * 100 + 20; // Random price between 50 and 150
    const volume = Math.random() * 1000 + 500; // Random volume between 500 and 1500

    data.push({
      date,
      price,
      volume,
    });
  }

  return data;
};
