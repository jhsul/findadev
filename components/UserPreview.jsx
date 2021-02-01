import { useUser } from "../hooks/user";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserCircle } from "@fortawesome/free-solid-svg-icons";

import { useRouter } from "next/router";
import Link from "next/link";

const UserPreview = (props) => {
  const user = useUser(props.username);
  const router = useRouter();
  const handleClick = () => {
    router.push(`/user/${props.username}`);
  };
  return user ? (
    <div className="user-preview p-2" onClick={handleClick}>
      <FontAwesomeIcon icon={faUserCircle} size="lg" className="mr-2" />
      <div className="usernames">
        <b className="m-0 close-text">{user.name}</b>
        <p className="mx-0 mt-1 mb-0 close-text">{user.username}</p>
      </div>
    </div>
  ) : (
    <div>Loading {props.username}'s profile</div>
  );
  /*
  return (
    <div className="user-preview" onClick={handleClick}>
      <FontAwesomeIcon
        icon={faUserCircle}
        size="lg"
        style={{ marginRight: "8pt" }}
      />
      <div>
        <p style={{ margin: "0" }}>
          <Link href={!user ? "/" : `/user/${user.username}`}>
            {user ? user.name : "Not Found"}
          </Link>
        </p>
        <p style={{ margin: "0" }}>{user ? user.username : "Not Found"}</p>
      </div>
    </div>
  ); */
};

export default UserPreview;
