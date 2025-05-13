import mongoose from "mongoose";


const Connectdb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      
      dbName: "Mygrocery"
    });
    console.log(`Mongodb connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default Connectdb;
 




