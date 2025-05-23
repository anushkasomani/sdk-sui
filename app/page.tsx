'use client'
import { Transaction } from "@mysten/sui/transactions";
import { ConnectButton, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useSuiClient } from "@mysten/dapp-kit";
import { useAccounts } from "@mysten/dapp-kit";

export default function Home() {
  const client = useSuiClient();
  const [account] = useAccounts();
  const { mutate: signAndExecute, isPending: isMinting } =
    useSignAndExecuteTransaction();
  const contractAddress = "0xa1d8197c4a9127119ff2ace14966c6c51797c847ab5e83cac408eb492804f7b3"
  const packageId = contractAddress; // Using same address as contract for package ID
  const battleCollectionId ="0xaa9d4f350ce4222551969afd372e4371d834833873de401c15b9b8e54ab08c64"
  const pet1Id="0x5a88cb7bcfe3f75bdd1b36d8a639181a9079fa0a4eaaa5a3123e09f4dcd5d041"
  const pet2Id="0xee798a82c55fb2702ecbb490b5d8634e1534aeb93426b5c62569425d4104f89e"
  // const parentObjectId="0x32521f30675c13a1976cf38979c69948cadff4f864c24099eab53214abda2d03"

  const mint = async () => {
    const txb = new Transaction();
    const petCollectionId = "0xa0c62d01496f82d3ca4d77d59a1624a952e264bba0417e11656ca0f6f54d2b2b";

    txb.moveCall({
      target: `${contractAddress}::tailz::mint_pet`,
      arguments: [
        txb.object(petCollectionId),
        txb.pure.string("hello"),
        txb.pure.string("https://i.pinimg.com/736x/79/98/a8/7998a8a5c592cfe0de8f1e0247a96afd.jpg"),
      ],
    });

    signAndExecute(
      {
        transaction: txb,
      },
      {
        onSuccess: async ({ digest }) => {
          const { effects } = await client.waitForTransaction({
            digest,
            options: {
              showEffects: true,
            },
          });
        },
      }
    );
  };

  const kioskiInit = async () => {
    
    const txb = new Transaction();
txb.moveCall({
  target: '0x2::kiosk::default'
});

signAndExecute(
  {
    transaction: txb,
  },
  {
    onSuccess: async ({ digest }) => {
      const { effects } = await client.waitForTransaction({
        digest,
        options: {
          showEffects: true,
        },
      });
    },
  }
);
  }
const createTransferPolicy = async () => {
  const tx = new Transaction();
    const [policy, policyCap] = tx.moveCall({
       target: `${contractAddress}::tailz::mint_pet`,
      typeArguments: [`${contractAddress}::tailz::DynamicNFT`]
    });

   
signAndExecute(
  {
    transaction: tx,
  },
  {
    onSuccess: async ({ digest }) => {
      const { effects } = await client.waitForTransaction({
        digest,
        options: {
          showEffects: true,
        },
      });
    },
  }
);
   


  }

  const claimPublisherId = async () => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${contractAddress}::tailz::get_publisher_id`,
      arguments: [tx.object("0xfb5ce0ac3138a99dadc1b4ca0320d11e7a7b47074bee2a16babf629a57b4d341")]
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          const { effects } = await client.waitForTransaction({
            digest,
            options: {
              showEffects: true,
            },
          });
        },
      }
    );
  };
const handleTransfer = async () => {

const address = '0xef1ee0644620c6ea1434dfd3ae9516c7668cdab4bb326fc41b6c28fe5cd4ac95';
const tailzType = '0x579ad18049f1d4f2edbb6464b98fe02bd1cbec74177da8919e712bff6fd43c9d::tailz::TAILZ';

const coins = await client.getCoins({
  owner: address,
  coinType: tailzType,
});

console.log('Your TAILZ coin object IDs:', coins.data.map(c => c.coinObjectId));

if (!coins.data || coins.data.length === 0) {
  throw new Error("No TAILZ coins found in your wallet");
}

const paymentCoinObjectId = coins.data[0].coinObjectId;
const tx = new Transaction();
const [stakeCoin] = tx.splitCoins(
  tx.object(coins.data[0].coinObjectId), 
  [tx.pure.u64(5_000_000)]
);

const globalId="0x4bdd37ed14b4c9c1938fd2441ce188337d19258086673e4cfc28ad49d09c55d7"
tx.moveCall({
  target: `${packageId}::tailz::stake`,
  arguments: [
    stakeCoin,// Coin<TAILZ> object
    tx.object(globalId)             // Global config object
  ],
  // typeArguments: [`${packageId}::tailz::TAILZ`]
});

tx.setGasBudget(300_000_000);
signAndExecute(
  {
    transaction: tx,
  },
  {
    onSuccess: async ({ digest }) => {
      const { effects } = await client.waitForTransaction({
        digest,
        options: {
          showEffects: true,
        },
      });
    },
  }
);


}

const createBattle = async () => {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${packageId}::tailz::create_battle`,
    arguments: [
      tx.object(battleCollectionId), // BattleCollection object
      tx.object(pet1Id),             // DynamicNFT object 1
      tx.object(pet2Id)              // DynamicNFT object 2
    ]
  });

  signAndExecute(
    {
      transaction: tx,
    },
    {
      onSuccess: async ({ digest }) => {
        const { effects } = await client.waitForTransaction({
          digest,
          options: {
            showEffects: true,
          },
        });
      },
    }
  );

}
  return (
    <div>
      <ConnectButton />
      <button onClick={mint} className="bg-blue-500 text-white p-2 rounded-md">
        Mint
      </button>

      <button onClick={kioskiInit} className="bg-blue-500 text-white p-2 rounded-md">
      kisoki try</button>

      <button className="bg-blue-500 text-white p-2 rounded-md" onClick={createTransferPolicy}>Create transafer policy</button>
      <button className="bg-blue-500 text-white p-2 rounded-md" onClick={claimPublisherId}>claim publisher id</button>
<button className="bg-blue-500" onClick={handleTransfer}>try sending TAILZ</button>

<button className="bg-blue-500" onClick={createBattle}>create battle</button>
    </div>
  );

}

 // tx.moveCall({
    //   target: '0x2::transfer::public_share_object',
    //   arguments: [policy],
    //   typeArguments: [`0x2::transfer_policy::TransferPolicy<${contractAddress}::tailz::DynamicNFT>`]
    // });

  
    