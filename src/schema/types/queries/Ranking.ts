import { intArg, stringArg } from "nexus";

import { INFORMATION_DTO } from "../../../DTO";
import { UserModel } from "../../../model/users";
import { getKindOfGenaration } from "../../../service/user";
import { connectMongoDB } from "../../../util/db";

import { sortBy } from "@fxts/core";

export const userRanking = {
  type: "User",
  args: {
    criteria: stringArg(),
    count: intArg(),
    page: intArg(),
    generation: intArg(),
  },
  resolve: (_: any, args: INFORMATION_DTO.GetRankingInput, __: any) =>
    connectMongoDB(() => UserModel.getRanking(args))(),
};

export const hasGeneration = {
  type: "Generation",
  resolve: (_: any, __: any, ___: any) =>
    connectMongoDB(async () =>
      sortBy((r) => r._id, await getKindOfGenaration()),
    )(),
};
