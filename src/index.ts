import express, { Express, Request, Response } from "express";
import {
  listAirdrops,
  getAirdrop,
  airdropNFT,
  updateAirdrop,
  redeemNFT,
  deleteAirdrop,
} from "./controllers/airdrop";
import { param, validationResult, checkSchema } from "express-validator";

const app: Express = express();
const port = process.env.PORT || "8888";

const checkAirdropSchema = checkSchema({
  contractAddress: { isString: true },
  recipient: { isString: true },
  quantity: { isNumeric: true },
});

const checkId = param("id").isString().escape();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("OK");
});

app.get("/airdrops", async (req: Request, res: Response) => {
  const airdrops = await listAirdrops();
  res.send(airdrops);
});

app.get("/airdrops/:id", checkId, async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.send({ errors: result.array() });
    return;
  }
  const airdrop = await getAirdrop(req.params.id);
  res.send(airdrop);
});

app.post(
  "/airdrops",
  checkAirdropSchema,
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.send({ errors: result.array() });
      return;
    }
    const body = req.body;
    const contractAddress = body.contractAddress;
    const recipient = body.recipient;
    const quantity = body.quantity;
    const success = await airdropNFT(contractAddress, recipient, quantity);
    if (!success) {
      res.status(400).send({ success });
      return;
    }
    res.send({ success });
  }
);

app.put(
  "/airdrops/:id",
  checkId,
  checkAirdropSchema,
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.send({ errors: result.array() });
      return;
    }
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
    if (!success) {
      res.status(400).send({ success });
      return;
    }
    res.send({ success });
  }
);

app.post(
  "/airdrops/redeem/:id",
  checkId,
  checkSchema({ walletAddress: { isString: true } }),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.send({ errors: result.array() });
      return;
    }
    const id = req.params.id;
    const walletAddress = req.body.walletAddress;
    const success = await redeemNFT(id, walletAddress);
    if (!success) {
      res.status(400).send({ success });
      return;
    }
    res.send({ success });
  }
);

app.delete("/airdrops/:id", checkId, async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.send({ errors: result.array() });
    return;
  }
  const id = req.params.id;
  const success = await deleteAirdrop(id);
  if (!success) {
    res.status(400).send({ success });
    return;
  }
  res.send({ success });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
