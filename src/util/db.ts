import * as mongoose from "mongoose";

export const connectMongoDB: Function = (next: (...args: any[]) => any) => {
  return async (...args: any[]) => {
    const db = await mongoose.connect(process.env.MongoDBUrl ?? "", {
      useFindAndModify: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    const result = await next(...args);
    if (result) {
      db.disconnect();
    }
    return result;
  };
};
