export type CriteriaValueType = {
  [key: string]: 1 | -1;
};
export type RankingSortCriteriaType = {
  contributions: CriteriaValueType;
  pullRequests: CriteriaValueType;
  issues: CriteriaValueType;
  repositoriesContributedTo: CriteriaValueType;
  publicRepositories: CriteriaValueType;
  stared: CriteriaValueType;
  forked: CriteriaValueType;
  followers: CriteriaValueType;
  following: CriteriaValueType;
};

export const RankingSortCriteria: RankingSortCriteriaType = {
  contributions: { contributions: -1 },
  pullRequests: { pullRequests: -1 },
  issues: { issues: -1 },
  repositoriesContributedTo: { repositoriesContributedTo: -1 },
  publicRepositories: { publicRepositories: -1 },
  stared: { stared: -1 },
  forked: { forked: -1 },
  followers: { followers: -1 },
  following: { following: -1 },
};

export interface GetRankingInput {
  count: number;
  page: number;
  criteria: keyof typeof RankingSortCriteria;
  generation: number;
}

export type Ranking = keyof typeof RankingSortCriteria;
