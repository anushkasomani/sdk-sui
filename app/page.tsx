'use client'
import { Transaction } from "@mysten/sui/transactions";
import { ConnectButton, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useSuiClient } from "@mysten/dapp-kit";
import { useAccounts } from "@mysten/dapp-kit";
import { useEffect } from "react";

export default function Home() {
  const client = useSuiClient();
  const [account] = useAccounts();
  const { mutate: signAndExecute, isPending: isMinting } =
    useSignAndExecuteTransaction();
    const NFT_Collection_ID="0xc03ee66d6922dcb94a79c1f8fb9252575044e117106219b725a3d4e032bce40b"
    const packageId="0x58ef067daa0ad013898fb0a8c05cab46820c6521bfc0ec5570c20747d55d3d12"
    const global_id="0x7aeb26d8e631b516a9d0f2789214867bba25ffff6a8d520d68ae5c52440be2f6"
    const battleCollectionId="0xd848c8b40736f054f1834ac5d13699967989ae47e9a1f54338598e1fb8833466"
  const pet1Id="0x6201e550bd850cb488948dc55ea9dfc03ba958d433dd7ccce558be3f372be710"
  const pet2Id="0xa713ccfbccd99d91a461e631a77880d3c6021d5d9dd59e0d483a7f378e51da54"
  // const parentObjectId="0x32521f30675c13a1976cf38979c69948cadff4f864c24099eab53214abda2d03"

  const mint = async () => {
    const txb = new Transaction();
    const petCollectionId = "0xa0c62d01496f82d3ca4d77d59a1624a952e264bba0417e11656ca0f6f54d2b2b";

    txb.moveCall({
      target: `${packageId}::tailz::mint_pet`,
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
       target: `${packageId}::tailz::mint_pet`,
      typeArguments: [`${packageId}::tailz::DynamicNFT`]
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
      target: `${packageId}::tailz::get_publisher_id`,
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
      tx.pure.u256(pet1Id),             // DynamicNFT object 1
      tx.pure.u256(pet2Id)              // DynamicNFT object 2
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
useEffect(() => {
  const fetchAllBattles = async () => {
    // 1. Get BattleCollection
    const collection = await client.getObject({
      id: battleCollectionId,
      options: { showContent: true }
    });
  
    // 2. Get battles table ID
    const battlesTableId = collection.data?.content?.fields.battles?.fields.id.id;
  
    // 3. Get all battle entries
    const battles = await client.getDynamicFields({
      parentId: battlesTableId,
    });
  
    // 4. Fetch full battle data
    return Promise.all(
      battles.data.map(async (battle) => {
        const battleData = await client.getObject({
          id: battle.objectId,
          options: { showContent: true },
        });
  
        const fields = battleData.data?.content?.fields;
        return {
          id: battleData.data?.objectId,
          battle_id: fields?.battle_id,
          pet1: fields?.pet1,
          pet2: fields?.pet2,
          stake_total_pet1: fields?.stake_total_pet1,
          stake_total_pet2: fields?.stake_total_pet2,
          creator: fields?.creator,
          is_active: fields?.is_active,
          stake_info: fields?.stake_info // Contains nested stakes
        };
      })
    );
  };
  
  // Usage
  fetchAllBattles().then(battles => {
    console.log('All Battles:', battles);
  });
}, []);

  return (
    <div className="flex flex-col items-center h-screen gap-4">
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
    //   typeArguments: [`0x2::transfer_policy::TransferPolicy<${packageId}::tailz::DynamicNFT>`]
    // });

  
    