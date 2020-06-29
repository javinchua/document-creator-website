import { ContractFunctionState } from "@govtechsg/ethers-contract-hook";
import { useState } from "react";
import { publishJob } from "../../../services/publishing";
import { Config, FormEntry, PublishingJob, WrappedDocument } from "../../../types";
import { getPublishingJobs } from "./utils/publish";

export const usePublishQueue = (
  config: Config,
  formEntries: FormEntry[]
): {
  error?: string;
  publishState: string;
  publish: () => void;
  wrappedDocuments: WrappedDocument[];
} => {
  const [error, setError] = useState<string>();
  const [publishState, setPublishState] = useState<ContractFunctionState>("UNINITIALIZED");
  const [jobs, setJobs] = useState<PublishingJob[]>([]);
  const [completedJobIndex, setCompletedJobIndex] = useState<number[]>([]);

  const wrappedDocuments = completedJobIndex.reduce((acc, curr) => {
    const documentsIssuesInJob = jobs[curr].documents;
    return [...acc, ...documentsIssuesInJob];
  }, [] as WrappedDocument[]);

  const publish = async (): Promise<void> => {
    try {
      // Cannot use setCompletedJobIndex here as async update does not with the promise race
      const completedJobs: number[] = [];
      setPublishState("INITIALIZED");
      console.log("wallet", config.wallet);
      const nonce = await config.wallet.getTransactionCount();
      const publishingJobs = getPublishingJobs(formEntries, config, nonce);
      setJobs(publishingJobs);
      const deferredJobs = publishingJobs.map((job, index) =>
        publishJob(job, config.wallet).then(() => {
          completedJobs.push(index);
          setCompletedJobIndex(completedJobs);
        })
      );
      setPublishState("PENDING_CONFIRMATION");
      await Promise.all(deferredJobs);
      setCompletedJobIndex(completedJobs);
      setPublishState("CONFIRMED");
    } catch (e) {
      console.error(e);
      setError(e.message);
      setPublishState("ERROR");
    }
  };

  return { publish, publishState, error, wrappedDocuments };
};
