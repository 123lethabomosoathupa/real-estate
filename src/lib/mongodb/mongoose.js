import mongoose from 'mongoose';

let initialized = false;

export const connect = async () => {
  mongoose.set('strictQuery', true);

  if (initialized) {
    return;
  }

  try {
    // Build URI with database name embedded — works reliably on all hosts
    const uri = process.env.MONGODB_URI;
    // Insert /next-estate before the ? query string if not already present
    const uriWithDb = uri.includes('/next-estate')
      ? uri
      : uri.replace('mongodb.net/', 'mongodb.net/next-estate');

    await mongoose.connect(uriWithDb);
    initialized = true;
    console.log('MongoDB connected to next-estate db');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};
