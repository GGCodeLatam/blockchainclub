import React, { useEffect, useState } from 'react';
import {
    useMintNFT,
    useLogin,
    useLogout,
    useContract,
    useUser,
    useUnclaimedNFTSupply,
    useNFTs,
    useAddress,
    useMetamask,
} from "@thirdweb-dev/react/evm";
import { useRouter } from "next/router";
import { NFT } from "@thirdweb-dev/sdk";
import Link from "next/link";
import Image from "next/image";

function LoginPage() {
    const [usersNft, setUsersNft] = useState<NFT | undefined>();
    const login = useLogin();
    const logout = useLogout();
    const router = useRouter();
    const { user } = useUser();
    const connect = useMetamask();
    const publicKey: any = useAddress();
    const address: string = String(publicKey);
    const quantity = 1;

    const { contract } = useContract(
        process.env.NEXT_PUBLIC_PROGRAM_ADDRESS,
        "nft-drop"
    );

    const { data: unclaimedSupply } = useUnclaimedNFTSupply(contract);
    const { data: nfts, isLoading } = useNFTs(contract);
    const { mutateAsync: mintNft } = useMintNFT(contract);

    useEffect(() => {
        if (!publicKey) {
            connect();
        }
    }, [publicKey]);

    useEffect(() => {
        if (!user || !nfts) return;

        const userNft = nfts.find((nft) => nft.owner === user?.address);

        if (userNft) {
            setUsersNft(userNft);
        }
    }, [nfts, user]);

    const handleLogin = async () => {
        await login();
        router.replace("/");
    };

    const handlePurchase = async (contract:any) => {
        const tx = await contract.claimTo(address, quantity);
        const receipt = tx[0].receipt;
        const claimedTokenId = tx[0].id;
        const claimedNFT = await tx[0].data();
        router.replace("/")
    };


    return (
        <div className="flex min-h-screen flex-col items-center justify-center text-center bg-[#000]">
            <div className='absolute top-56 left-0 w-full h-1/4 bg-yellow-600 -skew-y-6 z-10 overflow-hidden shadow-xl'></div>
            <Image
                className='mt-5 z-30 shadow-2xl mb-10 rounded-full'
                src='https://i.postimg.cc/y867D7Jm/blockchain-club.jpg'
                alt='blockchain club'
                width={400}
                height={400}
            />
            <main className='z-30 text-white'>
                <h1 className='text-4xl font-bold uppercase'>
                    Welcome to the <span className='text-yellow'>Blockchain Club</span>
                </h1>
                {!user && (
                    <div>
                        <button
                            onClick={handleLogin}
                            className="text-2xl font-bold mb-5 bg-yellow-600 text-black py-4 px-10 border-2 border-fusbg-yellow-600 anima-pulse rounded-md transition duration-200 mt-5">
                            Login / Connect Wallet

                        </button>
                    </div>
                )}
                {user && (
                    <div>
                        <p className='text-lg text-yellow-600 font-bold mb-10'>
                            Welcome {user.address.slice(0, 5)}...{user.address.slice(-5)}
                        </p>
                        {isLoading && (
                            <div className='text-2xl font-bold mb-5 bg-yellow-600 text-white py-4 px-10 border-2 border-fusbg-yellow-600 animate-pulse rounded-md transition duration-200'>
                                Hold on, We're just looking for your Blockchain Club Pass...
                            </div>
                        )}
                        {usersNft && (
                            <Link
                            href="/"
                            className='text-2xl font-bold mb-5 bg-yellow-600 text-white py-4 px-10 border-2 border-fusbg-yellow-600 animate-pulse rounded-md transition duration-200 hover:bg-white hover:text-yellow-600 mt-5 uppercase'
                            >
                                ACCESS GRANTED - ENTER
                            </Link>
                        )}
{/*                         {!usersNft &&
                            !isLoading
                            (unclaimedSupply && unclaimedSupply > 0 ? (
                                <button>

                                </button>
                            ) : (
                                <p></p>
                            ))} */}
                    </div>
                )}
            </main>

        </div>
    )
}

export default LoginPage;