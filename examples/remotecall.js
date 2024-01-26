import { RemoteCatAI } from "catai";

const catai = new RemoteCatAI("ws://localhost:3000");

catai.on("open", async () => {
  console.log("Connected");
  const response = await catai.prompt("Write me 100 words story", (token) => {
    process.stdout.write(token);
  });

  console.log(`Total text length: ${response.length}`);
  catai.close();
});
