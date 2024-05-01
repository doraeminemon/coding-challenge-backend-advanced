import { nanoid } from "nanoid";

export class AirdropJobStore {
  jobDetails: Record<
    string,
    { nftContractAddress: string; redeemed: number; quantity: number }
  > = {};
  constructor() {}
  generateAirdropJobDetails(contractAddress: string, quantity: number = 10) {
    this.jobDetails[nanoid()] = {
      nftContractAddress: contractAddress,
      redeemed: 0,
      quantity,
    };
  }
  retrieveAirdropDetails(redeemCode: string) {
    return this.jobDetails[redeemCode];
  }
  markAirdropRedeemed(redeemCode: string) {
    const job = this.jobDetails[redeemCode];
    if (job.redeemed < job.quantity) {
      this.jobDetails[redeemCode].redeemed += 1;
      return;
    }
    throw new Error("Limit exceeded");
  }
}
