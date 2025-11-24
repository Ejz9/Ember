import mongoose from 'mongoose';

export default defineNitroPlugin(async (nitroApp) => {
  const config = useRuntimeConfig();

  if (!config.MONGODB_URI) {
    console.error('FATAL: MONGODB_URI environment variable is not defined.');
    process.exit(1);
  }

  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('DB connection established');

    // Initialize auth right after the DB connection is ready
    initAuth();
    console.log('Auth initialized');
  } catch (err) {
    console.error('FATAL: DB connection failed');
    console.error(err);
    process.exit(1);
  }
});
