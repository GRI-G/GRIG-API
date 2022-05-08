import { Aggregate } from "mongoose";
import { UserModel } from "../model/users";

export const getKindOfGenaration: Function = (): Aggregate<any[]> =>
  UserModel.aggregate([
    { $match: { generation: { $exists: true } } },
    // count grouping status
    { $group: { _id: "$generation", count: { $sum: 1 } } },
  ]);
