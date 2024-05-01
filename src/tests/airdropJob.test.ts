import { AirdropJobStore } from "../models/airdropJob";

describe("AirdropJobStore", () => {
  test("#listAirdropDetails", () => {
    const items = {
      asd: {
        nftContractAddress: "asd",
        quantity: 2,
        recipient: "Tyson Do",
        redeemedBy: [],
      },
    };
    const airdropJobStore = new AirdropJobStore(items);
    const result = airdropJobStore.listAirdropDetails();
    expect(JSON.stringify(result)).toBe(JSON.stringify(items));
  });

  test("#retrieveAirdropDetails", () => {
    const items = {
      asd: {
        nftContractAddress: "asd",
        quantity: 2,
        recipient: "Tyson Do",
        redeemedBy: [],
      },
    };
    const airdropJobStore = new AirdropJobStore(items);
    const result = airdropJobStore.retrieveAirdropDetails("asd");
    expect(JSON.stringify(result)).toBe(JSON.stringify(items.asd));
  });

  test("#deleteAirdropDetails", () => {
    const items = {
      asd: {
        nftContractAddress: "asd",
        quantity: 2,
        recipient: "Tyson Do",
        redeemedBy: [],
      },
    };
    const airdropJobStore = new AirdropJobStore(items);
    airdropJobStore.deleteAirdrop("asd");
    const result = airdropJobStore.retrieveAirdropDetails("asd");
    expect(result).toBe(undefined);
  });

  test("#updateAirdropDetails", () => {
    const items = {
      asd: {
        nftContractAddress: "asd",
        quantity: 2,
        recipient: "Tyson Do",
        redeemedBy: [],
      },
    };
    const airdropJobStore = new AirdropJobStore(items);
    airdropJobStore.updateAirdropDetails("asd", {
      nftContractAddress: "asdff",
    });
    const result = airdropJobStore.retrieveAirdropDetails("asd");
    expect(result.nftContractAddress).toBe("asdff");
  });

  test("#generateAirdropJobDetails", () => {
    const items = {
      asd: {
        nftContractAddress: "asd",
        quantity: 2,
        recipient: "Tyson Do",
        redeemedBy: [],
      },
    };
    const airdropJobStore = new AirdropJobStore();
    airdropJobStore.generateAirdropJobDetails(
      items.asd.nftContractAddress,
      "Tyson Do",
      5
    );
    const result = airdropJobStore.listAirdropDetails();
    expect(Object.entries(result).length).toBe(1);
  });

  test("#markAirdropRedeemed success", () => {
    const items = {
      asd: {
        nftContractAddress: "asd",
        quantity: 2,
        recipient: "Tyson Do",
        redeemedBy: [],
      },
    };
    const airdropJobStore = new AirdropJobStore(items);
    airdropJobStore.markAirdropRedeemed("asd", "new wallet address");
    const result = airdropJobStore.listAirdropDetails();
    expect(result["asd"].redeemedBy[0]).toBe("new wallet address");
  });

  test("#markAirdropRedeemed failed", () => {
    const items = {
      asd: {
        nftContractAddress: "asd",
        quantity: 1,
        recipient: "Tyson Do",
        redeemedBy: ["already redeemed"],
      },
    };
    const airdropJobStore = new AirdropJobStore(items);
    const result = airdropJobStore.markAirdropRedeemed(
      "asd",
      "new wallet address"
    );
    expect(result).toBeFalsy();
  });
});
