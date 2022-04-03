"use strict";

import * as mongoose from "mongoose";

import { serverless_DTO } from "./DTO";

import { UserModel } from "./src/model/users";
import { CodeModel } from "./src/model/code";

import { getAccessTokenByCode, getUserByToken } from "./src/util/github";
import { generateToken, verifyToken } from "./src/util/token";
import { sendAuthMessage } from "./src/util/email";

import {
  createUser,
  createToken,
  updateUserInformation,
  findUserByNickname,
  testIsGSMEmail,
} from "./util/user";

const createRes: Function = (
  status: number,
  body?: Object,
  headers?: Object,
) => {
  return {
    statusCode: status,
    body: JSON.stringify(body),
    headers: headers,
  };
};

exports.authUserByOAuth = async (
  event: serverless_DTO.eventType,
  _: any,
  __: Function,
) => {
  const data = event.queryStringParameters;
  const access_token = (await getAccessTokenByCode(data.code)).access_token;
  const { name, nickname } = await getUserByToken(access_token);
  const code = generateToken({ nickname: nickname }, "180m");

  let page = "complete.html";
  const user = await findUserByNickname(nickname);
  if (!user?.certified) {
    if (!user) {
      await createUser({
        accessToken: access_token,
        name: name ?? " ",
        nickname: nickname,
      });
    }

    page = "email_auth.html";
  }

  return createRes(
    302,
    {},
    { Location: `${process.env.AUTH_BASEURL}${page}?code=${code}` },
  );
};

exports.authEmail = async (
  event: serverless_DTO.eventType,
  _: any,
  __: Function,
) => {
  const searchPrams = new URLSearchParams(event.body);
  const code = searchPrams.get("code");
  const email = searchPrams.get("email");

  if (testIsGSMEmail(email)) {
    return createRes(400, { detail: "GSM 학생 계정이어야합니다." });
  }

  const nickname = verifyToken(code).nickname;
  const token = await createToken({ email: email, nickname: nickname });
  await sendAuthMessage({
    receiver: email,
    nickname: nickname,
    token: token.id,
  });
  return createRes(204);
};

exports.authUserByEmail = async (event: serverless_DTO.eventType, _: any) => {
  mongoose
    .connect(process.env.MongoDBUrl ?? "", {
      useFindAndModify: false,
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then((): void => console.log("MongoDB connected"))
    .catch((err: Error): void =>
      console.log("Failed to connect MongoDB: ", err),
    );
  const dataId = event.pathParameters["token"];
  const data = await CodeModel.findById(dataId);

  const email: string = data.email;
  const nickname: string = data.nickname;
  const generation: number = testIsGSMEmail(email)
    ? Number(email.replace(/[^0-9]/g, "").slice(0, 2)) - 16
    : 0;

  if (generation === 0) {
    createRes(404, { message: "GSM 학생이 아닙니다." });
  }

  const user = await UserModel.findUserFromNickname(nickname);
  try {
    await user.updateGeneration(generation);
    console.log("Success update Generation");
    await user.setCertifiedTrue();
    console.log("Success Set Certified True");
    await updateUserInformation(user);
    console.log("Update User Information");
  } catch (e: any) {
    console.error(e);
  }

  await CodeModel.findByIdAndDelete(dataId);
  console.log("Success find By Id and delete data Id");

  return createRes(
    302,
    {},
    { Location: `${process.env.AUTH_BASEURL}complete.html` },
  );
};
