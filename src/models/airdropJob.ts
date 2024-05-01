import { nanoid } from "nanoid";

export type Airdrop = {
  nftContractAddress: string;
  redeemedBy: string[];
  quantity: number;
  recipient: string;
};

export class AirdropJobStore {
  jobDetails: Record<string, Airdrop> = {};
  constructor() {}
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
  markAirdropRedeemed(redeemCode: string, redeemedBy: string) {
    const job = this.jobDetails[redeemCode];
    if (job.redeemedBy.length < job.quantity) {
      this.jobDetails[redeemCode].redeemedBy.push(redeemedBy);
      return true;
    }
    // throw new Error("Limit exceeded");
    return false;
  }
}
