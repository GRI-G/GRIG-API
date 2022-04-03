import * as mongoose from "mongoose";

export const connectMongoDB: Function = (next: () => any) => {
  return async () => {
    const db = await mongoose.connect(process.env.MongoDBUrl ?? "", {
      useFindAndModify: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    const result = await next();
    if (result) {
      db.disconnect();
    }
    return result;
  };
};
