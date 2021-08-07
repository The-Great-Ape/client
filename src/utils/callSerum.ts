
/**
 * Makes an ajax request to fetch token information from the serum api
 * @param {string} type
 * @returns json object of data.
 */
export default async function callSerum(type : string, publicKey : string) {
  const bodies: {[key: string]: object} = {
    staked: {
      method: "getProgramAccounts",
      jsonrpc: "2.0",
      params: [
        "9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z",
        {
          commitment: "confirmed",
          filters: [
            { memcmp: { offset: 40, bytes: publicKey } },
            { dataSize: 96 },
          ],
          encoding: "base64",
        },
      ],
      id: "84203270-a3eb-4812-96d7-0a3c40c87a88",
    },
    balances: {
      method: "getTokenAccountsByOwner",
      jsonrpc: "2.0",
      params: [
        publicKey,
        { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
        { encoding: "jsonParsed", commitment: "processed" },
      ],
      id: "35f0036a-3801-4485-b573-2bf29a7c77d2",
    },
    solBalances: {
      method: "getBalance",
      jsonrpc: "2.0",
      params: [publicKey],
      id: "35f0036a-3801-4485-b573-2bf29a7c77d2",
    },
  };
  const response = await fetch("https://solana-api.projectserum.com/", {
    method: "POST",
    body: JSON.stringify(bodies[type]),
    headers: { "Content-Type": "application/json" },
  });
  const json = await response.json();
  return json;
}
