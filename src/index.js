import 'dotenv/config';
import { initMongoConnection } from './db/initMongoConnection.js';
import app from './server.js';
import { getEnvVar } from './utils/getEnvVar.js';

const PORT = Number(getEnvVar('PORT', '3000'));

async function startServer() {
  try {
    await initMongoConnection();
    console.log('Mongo connection successfully established!');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

startServer();
