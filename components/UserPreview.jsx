import { useUser } from "../hooks/user";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import { useRouter } from "next/router";
import Link from "next/link";

const UserPreview = (props) => {
  const user = useUser(props.username);
  const router = useRouter();
  const handleClick = () => {
    router.push(`/user/${props.username}`);
  };
  return (
    <div className="user-preview" onClick={handleClick}>
      <FontAwesomeIcon icon={faUser} size="lg" style={{ marginRight: "8pt" }} />
      <div>
        <p style={{ margin: "0" }}>
          <Link href={!user ? "/" : `/user/${user.username}`}>
            {user ? user.name : "Not Found"}
          </Link>
        </p>
        <p style={{ margin: "0" }}>{user ? user.username : "Not Found"}</p>
      </div>
    </div>
  );
};

export default UserPreview;
