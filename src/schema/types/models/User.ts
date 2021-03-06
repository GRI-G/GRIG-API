import { objectType } from "nexus";

export const User = objectType({
  name: "User",
  definition(t) {
    t.string("name");
    t.int("generation");
    t.string("nickname");
    t.int("followers");
    t.int("following");
    t.string("repos_url");
    t.int("public_repos");
    t.string("avatar_url");
    t.string("company");
    t.string("blog");
    t.string("location");
    t.string("email");
    t.string("bio");
    t.string("twitter_username");
    t.int("contributions");
    t.int("pullRequests");
    t.int("issues");
    t.int("publicRepositories");
    t.int("stared");
    t.int("forked");
  },
});
