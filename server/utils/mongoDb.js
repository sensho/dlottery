import mongoose from 'mongoose';

const dbConnect = () =>
	mongoose
		.connect(process.env.MONGO_DB_URL || `mongodb://localhost:27017/dlottery`)
		.then(() => {
			console.log('Database connection successful');
		})
		.catch((err) => {
			console.log('Database connection error', err);
		});

export default dbConnect;
