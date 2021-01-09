import useSWR from "swr";

import fetcher from "../lib/fetcher";

export function useCurrentUser() {
  const { data, mutate } = useSWR("/api/me", fetcher);
  const user = data && data.user;
  return [user, { mutate }];
}

export function useUser(username) {
  const { data } = useSWR(`/api/user/${username}`, fetcher, {
    revalidateOnFocus: false,
  });
  return data?.user;
}
