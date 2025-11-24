import mongoose from 'mongoose';

export default defineNitroPlugin(async (nitroApp) => {
  const config = useRuntimeConfig();

  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('DB connection established');

    // Initialize auth right after the DB connection is ready
    initAuth();
    console.log('Auth initialized');
  } catch (err) {
    console.error('DB connection or Auth initialization failed', err);
  }
});
