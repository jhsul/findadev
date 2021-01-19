import LandingPage from "../components/LandingPage";
import NavigationBar from "../components/NavigationBar";
import JobPreview from "../components/JobPreview";

import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";

import { useCurrentUser } from "../hooks/user";

//SSR import, not for client
import { getDb } from "../middlewares/database";

const Index = (props) => {
  const router = useRouter();
  const [user, { mutate }] = useCurrentUser();

  const handlePageChange = (data) => {
    router.push(`/?page=${data.selected + 1}`);
  };

  return (
    <>
      <NavigationBar />
      {user ? (
        <div className="page page-centered">
          <div className="job-list">
            {props.jobList.map((job) => (
              <JobPreview job={job} key={job._id} />
            ))}
            <ReactPaginate
              breakClassName="page-item"
              breakLabel={<a className="page-link">...</a>}
              pageClassName="page-item"
              previousClassName="page-item"
              nextClassName="page-item"
              pageLinkClassName="page-link"
              previousLinkClassName="page-link"
              nextLinkClassName="page-link"
              containerClassName="pagination"
              initialPage={props.page - 1}
              pageCount={props.pageCount}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : (
        <LandingPage />
      )}
    </>
  );
};
export const getServerSideProps = async (context) => {
  //return { props: { penis: "boob" } };
  const postsPerPage = 5;
  const page = context.query.page || 1;
  const skips = postsPerPage * (page - 1);

  const db = await getDb();

  const jobCount = await db.collection("jobs").countDocuments();
  const pageCount = Math.ceil(jobCount / postsPerPage);

  const jobsRes = await db
    .collection("jobs")
    .find({})
    .sort({ _id: -1 })
    .skip(skips)
    .limit(postsPerPage)
    .toArray();

  return {
    props: {
      page,
      pageCount,
      jobList: jobsRes.map((job) => {
        return {
          ...job,
          bids: job.bids.map((bidId) => bidId.toHexString()),
          _id: job._id.toHexString(),
        };
      }),
    },
  };
};
export default Index;
