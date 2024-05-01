import { nanoid } from "nanoid";
import Bull from "bull";

export type Airdrop = {
  nftContractAddress: string;
  redeemedBy: string[];
  quantity: number;
  recipient: string;
};

export type Redemption = {
  redeemedBy: string;
  redeemCode: string;
};

/**
 * In memory store for airdrops
 */
export class AirdropJobStore {
  jobDetails: Record<string, Airdrop> = {};
  airdropQueue: Bull.Queue<Redemption>;
  constructor(jobDetails: Record<string, Airdrop> = {}) {
    this.jobDetails = jobDetails;
    this.airdropQueue = new Bull("airdrop", {
      redis: "localhost:6379",
    });
    this.airdropQueue.process((redemption) => {
      const job = this.jobDetails[redemption.data.redeemCode];
      if (job.redeemedBy.length < job.quantity) {
        this.jobDetails[redemption.data.redeemCode].redeemedBy.push(
          redemption.data.redeemedBy
        );
        return true;
      }
      // throw new Error("Limit exceeded");
      return false;
    });
  }
  generateAirdropJobDetails(
    contractAddress: string,
    recipient: string,
    quantity: number = 10
  ) {
    this.jobDetails[nanoid()] = {
      nftContractAddress: contractAddress,
      redeemedBy: [],
      quantity,
      recipient,
    };
    return true;
  }
  retrieveAirdropDetails(redeemCode: string) {
    return this.jobDetails[redeemCode];
  }
  listAirdropDetails() {
    return this.jobDetails;
  }
  updateAirdropDetails(id: string, airdropInfo: Partial<Airdrop>) {
    this.jobDetails[id] = { ...this.jobDetails[id], ...airdropInfo };
    return true;
  }
  deleteAirdrop(id: string) {
    delete this.jobDetails[id];
    return true;
  }
  async markAirdropRedeemed(redeemCode: string, redeemedBy: string) {
    this.airdropQueue.add({
      redeemCode,
      redeemedBy,
    });
  }
}
