import { GoogleAuth } from "google-auth-library";
import fs from "fs";

async function main() {
  const auth = new GoogleAuth({
    keyFile: "service_account.json",
    scopes: ["https://www.googleapis.com/auth/blogger"],
  });

  const client = await auth.getClient();
  const token = await client.getAccessToken();
  console.log("ACCESS TOKEN:\n", token.token);
  
  fs.writeFileSync(".env", `VITE_BLOGGER_ACCESS_TOKEN=${token.token}\n`, { flag: "a" });
  console.log("✅ Saved to .env");
}

main();
