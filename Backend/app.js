import express from 'express';
import db from './utils/dbConnection.js';
import dotenv from 'dotenv';
dotenv.config();
import appRoutes from './routes/appRoutes.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', appRoutes);



const PORT = 4000;
const url =
  "mongodb+srv://learnMongodb:HLrsY7oQwSKhOnD0@lerarnmongodb.lvnv3wl.mongodb.net/FANA";
// const url = process.env.url;
const server = async () => {
  try {
    await db(url);
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("❌ Server failed to start:", error);
  } 
};

server(); 