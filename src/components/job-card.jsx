/* eslint-disable react/prop-types */
import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteJob, saveJob } from "@/api/apiJobs";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();

  const { loading: loadingDeleteJob, fn: fnDeleteJob } = useFetch(deleteJob, {
    job_id: job.id,
  });

  const {
    loading: loadingSaveJob,
    data: savedJobData,
    fn: fnSaveJob,
  } = useFetch(saveJob);

  const handleSaveToggle = async () => {
    if (!user) return;

    // Optimistic UI update
    setSaved((prev) => !prev);

    try {
      await fnSaveJob(
        { alreadySaved: saved },
        { user_id: user.id, job_id: job.id }
      );
      onJobAction();
    } catch (error) {
      console.error("Error toggling saved job:", error);
      // Rollback state on error
      setSaved((prev) => !prev);
    }
  };

  const handleDeleteJob = async () => {
    try {
      await fnDeleteJob();
      onJobAction();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  useEffect(() => {
    if (savedJobData !== undefined) setSaved(savedJobData?.length > 0);
  }, [savedJobData]);

  return (
    <Card className="flex flex-col">
      {loadingDeleteJob && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="font-bold">{job.title}</CardTitle>
          {isMyJob && (
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-500 cursor-pointer"
              onClick={handleDeleteJob}
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between items-center">
          {job.company && (
            <img
              src={job.company.logo_url}
              alt={`${job.company.name} logo`}
              className="h-6"
            />
          )}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} /> {job.location}
          </div>
        </div>
        <hr />
        {job.description.substring(0, job.description.indexOf("."))}.
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>
        {!isMyJob && (
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveToggle}
            disabled={loadingSaveJob}
          >
            {saved ? (
              <Heart size={20} fill="red" stroke="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
