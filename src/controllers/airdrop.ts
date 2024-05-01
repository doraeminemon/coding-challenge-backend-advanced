import { AirdropJobStore } from "../models/airdropJob";
import type { Airdrop } from "../models/airdropJob";

const airdropJobStore = new AirdropJobStore();

export const airdropNFT = async (
  contractAddress: string,
  recipient: string,
  quantity: number
) => {
  airdropJobStore.generateAirdropJobDetails(
    contractAddress,
    recipient,
    quantity
  );
  return true;
};

export const redeemNFT = async (redeemCode: string, walletAddress: string) => {
  return airdropJobStore.markAirdropRedeemed(redeemCode, walletAddress);
};

export const listAirdrops = async () => {
  return airdropJobStore.listAirdropDetails();
};
export const getAirdrop = async (id: string) => {
  return airdropJobStore.retrieveAirdropDetails(id);
};
export const updateAirdrop = async (
  id: string,
  updateInfo: Partial<Airdrop>
) => {
  return airdropJobStore.updateAirdropDetails(id, updateInfo);
};
export const deleteAirdrop = async (id: string) => {
  return airdropJobStore.deleteAirdrop(id);
};
