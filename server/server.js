import dotenv from 'dotenv';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

const { default: app } = await import('./src/app.js');
const { default: connectDB } = await import('./src/config/db.js');

const port = process.env.PORT || 3000;

// if database connection is successful, start the server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
});
