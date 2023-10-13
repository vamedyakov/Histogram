import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { ChartData } from "react-native-chart-kit/dist/HelperTypes";

import type { PullRequest } from "./types";
import { RootState } from "../store";

const pullRequestsAdapter = createEntityAdapter<PullRequest>({
  selectId: (pull) => pull.id,
  sortComparer: (a, b) => Date.parse(b.merged_at) - Date.parse(a.merged_at),
});

export const pullRequestsSlice = createSlice({
  name: "pulls",
  initialState: pullRequestsAdapter.getInitialState(),
  reducers: {
    addPullRequests: pullRequestsAdapter.addMany,
  },
});

export const { addPullRequests } = pullRequestsSlice.actions;

const globalizedSelectors = pullRequestsAdapter.getSelectors<RootState>(
  (state) => state.pulls,
);

export const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

export const getPullsBetweenDate = createSelector(
  [
    globalizedSelectors.selectAll,
    (_, start: Date = oneYearAgo, end: Date = new Date()) => ({
      start,
      end,
    }),
  ],
  (pulls: PullRequest[], { start, end }): PullRequest[] =>
    pulls.filter((pull) => {
      const merged_at = Date.parse(pull.merged_at);
      return merged_at >= start.getTime() && merged_at <= end.getTime();
    }),
);

// Map PullRequest[] to ChartData
export const getPullsChartData = createSelector(
  getPullsBetweenDate,
  (pulls: PullRequest[]): ChartData => {
    const data = pulls.reduce(
      (acc, pull) => {
        const merged_at = new Date(pull.merged_at);
        const month = merged_at.getMonth() + 1;
        const year = merged_at.getFullYear();
        const key = `${month}/${year}`;
        acc[key] = acc[key] ? acc[key] + 1 : 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    //Labels are sorted by month
    const labels = Object.keys(data).sort((a, b) => {
      const [aMonth, aYear] = a.split("/");
      const [bMonth, bYear] = b.split("/");
      return (
        (parseInt(aYear, 10) - parseInt(bYear, 10)) * 12 +
        (parseInt(aMonth, 10) - parseInt(bMonth, 10))
      );
    });

    return {
      labels,
      datasets: [{ data: labels.map((key) => data[key]) }],
    };
  },
);
