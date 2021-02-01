import useSWR from "swr";

import fetcher from "../lib/fetcher";

export const useBid = (bidId) => {
  if (!bidId) {
    return null;
  }
  const { data } = useSWR(`/api/bid/${bidId}`, fetcher);
  const bid = data;
  return bid;
};
