import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCurrentUser } from "../../hooks/user";

import NavigationBar from "../../components/NavigationBar";

const Account = () => {
  const [user, { mutate }] = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  const handleLogout = async () => {
    const res = await fetch("/api/auth", {
      method: "DELETE",
    });
    mutate(null);
  };
  return (
    <>
      <NavigationBar />
      <div className="page">
        <Button
          variant="secondary"
          onClick={() => router.push("/account/settings")}
        >
          Settings
        </Button>
        <Button variant="danger" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </>
  );
};

export default Account;
