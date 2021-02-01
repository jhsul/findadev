import useSWR from "swr";

import fetcher from "../lib/fetcher";

export const useJob = (jobId) => {
  if (!jobId) {
    return null;
  }
  const { data } = useSWR(`/api/job/${jobId}`, fetcher);
  const job = data;
  return job;
};
