import Error from "next/error";

import NavigationBar from "../components/NavigationBar";

const NotFound = () => {
  return (
    <>
      <NavigationBar />
      <Error statusCode={404} />
    </>
  );
};

export default NotFound;
