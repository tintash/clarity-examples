import express from "express";
import { logger } from "./logger";
import {
  getTokenName,
  getTokenSymbol,
  getTokenDecimals,
  getTokenSupply,
  getTokenURI,
  referUser,
  completeTransaction,
  setMnemonic,
} from "./contract-calls";

const app = express();
app.use(express.json());

app.get("/", (req, rsp) => {
  rsp.send("Refer Rewards token system!");
});

app.get("/contractAPI/tokenName", async (req, rsp) => {
  try {
    const name = await getTokenName();
    rsp.send(name);
  } catch (error) {
    rsp.status(404);
    rsp.send("Not Found - " + error);
  }
});

app.get("/contractAPI/tokenSymbol", async (req, rsp) => {
  try {
    const symbol = await getTokenSymbol();
    rsp.send(symbol);
  } catch (error) {
    rsp.status(404);
    rsp.send("Not Found - " + error);
  }
});

app.get("/contractAPI/tokenDecimals", async (req, rsp) => {
  try {
    const decimals = await getTokenDecimals();
    rsp.send(decimals);
  } catch (error) {
    rsp.status(404);
    rsp.send("Not Found - " + error);
  }
});

app.get("/contractAPI/tokenSupply", async (req, rsp) => {
  try {
    const token_supply = await getTokenSupply();
    rsp.send(token_supply);
  } catch (error) {
    rsp.status(404);
    rsp.send("Not Found - " + error);
  }
});

app.get("/contractAPI/tokenURI", async (req, rsp) => {
  try {
    const uri = await getTokenURI();
    rsp.send(uri);
  } catch (error) {
    rsp.status(404);
    rsp.send("Not Found - " + error);
  }
});

app.post("/contractAPI/setMnemonic", (req, rsp) => {
  const ret = setMnemonic(req.body.mnemonic);
  rsp.send(ret);
});

app.get("/referUser", async (req, rsp) => {
  const val = await referUser(req);
  rsp.send(val);
});

app.get("/completeTransaction", async (req, rsp) => {
  const val = await completeTransaction();
  rsp.send(val);
});

app.listen(3000, () => {
  logger.info("listening on port 3000...");
});
