import JobPreview from "./JobPreview";

import { useJob } from "../hooks/job";

const JobPreviewFromID = ({ jobId }) => {
  const job = useJob(jobId);
  return job ? <JobPreview job={job} /> : <div>Loading Job Preview</div>;
};

export default JobPreviewFromID;
