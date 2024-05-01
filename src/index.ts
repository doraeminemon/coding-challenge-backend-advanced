import express, { Express, Request, Response } from "express";
import {
  listAirdrops,
  getAirdrop,
  airdropNFT,
  updateAirdrop,
  redeemNFT,
  deleteAirdrop,
} from "./controllers/airdrop";

const app: Express = express();
const port = process.env.PORT || "8888";

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("OK");
});

app.get("/airdrops", async (req: Request, res: Response) => {
  const airdrops = await listAirdrops();
  res.send(airdrops);
});

app.get("/airdrops/:id", async (req: Request, res: Response) => {
  const airdrop = await getAirdrop(req.params.id);
  res.send(airdrop);
});

app.post("/airdrops", async (req: Request, res: Response) => {
  const body = req.body;
  const contractAddress = body.contractAddress;
  const recipient = body.recipient;
  const quantity = body.quantity;
  const success = await airdropNFT(contractAddress, recipient, quantity);
  res.send({ success });
});

app.put("/airdrops/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;
  const contractAddress = body.contractAddress;
  const recipient = body.recipient;
  const quantity = body.quantity;
  const success = await updateAirdrop(id, {
    nftContractAddress: contractAddress,
    recipient,
    quantity,
  });
  res.send({ success });
});

app.post("/airdrops/redeem/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const walletAddress = req.body.walletAddress;
  const success = await redeemNFT(id, walletAddress);
  res.send({ success });
});

app.delete("/airdrops/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const success = await deleteAirdrop(id);
  res.send({ success });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
