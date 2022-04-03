import { CodeModel } from "../src/model/code";
import { connectMongoDB } from "./db";

export const deleteRemainCode: Function = connectMongoDB(
  async (): Promise<void> => {
    var dateTime = new Date();
    dateTime.setMinutes(dateTime.getMinutes() - 5);
    await CodeModel.deleteMany({ createdAt: { $lte: dateTime } });
    console.log("사용되지않는 코드들 제거 완료");
    return;
  },
);
