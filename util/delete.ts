import { deleteRemainCode } from "./code";
import { deleteRemainNotCertifiedUser } from "./user";

async function deleteRemainDocument(): Promise<string> {
  await deleteRemainNotCertifiedUser();
  await deleteRemainCode();
  return "finish";
}

require("dotenv").config();
deleteRemainDocument().then((a) => {
  console.log(a);
  process.exit();
});
