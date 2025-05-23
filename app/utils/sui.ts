import { Transaction } from '@mysten/sui/transactions';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
export default async function mint() {
  console.log("minting")
  
  const txb = new Transaction();
const contractAdd="0x876d8ecbd74d854e82837cd26628a8f33c001601c9a65f16cbac7dd182b3e888"
const petCollectionId="0xa0c62d01496f82d3ca4d77d59a1624a952e264bba0417e11656ca0f6f54d2b2b"
txb.moveCall({
  target: `${contractAdd}::tailz::mint_pet`,
  arguments: [txb.object(petCollectionId), txb.pure.string("hello"),txb.pure.string("https://i.pinimg.com/736x/79/98/a8/7998a8a5c592cfe0de8f1e0247a96afd.jpg"), ],
});
// const result = await client.signAndExecuteTransaction({ signer: keypair, transaction: txb });
// await client.waitForTransaction({ digest: result.digest });

}
