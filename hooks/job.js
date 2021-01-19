import useSWR from "swr";

import fetcher from "../lib/fetcher";

export const useJob = (jobId) => {
  const { data } = useSWR(`/api/job/${jobId}`, fetcher);
  const job = data?.jobRes;
};
