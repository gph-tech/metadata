import { percentAmount, generateSigner, signerIdentity, createSignerFromKeypair } from '@metaplex-foundation/umi'
import { TokenStandard, createAndMint, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import "@solana/web3.js";
import secret from '/Users/alex/.config/solana/id.json';

const umi = createUmi('https://practical-nameless-pine.solana-devnet.quiknode.pro/93438d716db87e9261e5f905f65abb9e6e9ac06a/'); //Replace with your QuickNode RPC Endpoint

const userWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secret));
const userWalletSigner = createSignerFromKeypair(umi, userWallet);

const metadata = {
    name: "Foregate USD",
    symbol: "FGUSD",
    uri: "https://raw.githubusercontent.com/gph-tech/metadata/refs/heads/main/metadata.json", // metadata json
};

const mint = generateSigner(umi);
umi.use(signerIdentity(userWalletSigner)).use(mplTokenMetadata())

createAndMint(umi, {
    mint,
    authority: umi.identity,
    updateAuthority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 6,
    amount: 1000000000_000000,
    tokenOwner: userWallet.publicKey,
    tokenStandard: TokenStandard.Fungible,
    }).sendAndConfirm(umi).then(() => {
      console.log("Successfully minted 1 billion tokens (", mint.publicKey, ")");
    }
);
