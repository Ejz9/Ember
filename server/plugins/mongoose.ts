import mongoose from 'mongoose';
import { defineNitroPlugin, useRuntimeConfig } from '#imports';

export default defineNitroPlugin(async (nitroApp) => {
  const config = useRuntimeConfig();

  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('DB connection established');
  } catch (err) {
    console.error('DB connection failed', err);
  }
});