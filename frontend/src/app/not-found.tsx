'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
    const [catImage, setCatImage] = useState('/images/cat1.png');
    const [message, setMessage] = useState({ title: "SORRY", body: "we couldn't find that page" });

    useEffect(() => {
        // Randomly select one of the cat images (cat1.png to cat4.png)
        const randomNum = Math.floor(Math.random() * 4) + 1;
        setCatImage(`/images/cat${randomNum}.png`);

        // Randomly select a message
        const messages = [
            { title: "uh-oh!", body: "we can't seem to find that page" },
            { title: "404", body: "we couldn't find that page" },
            { title: "well, this is awkward", body: "we couldn't find that page" },
            { title: "SORRY", body: "the page you're looking for may have been removed, renamed, or is temporarily unavailable" },
            { title: "SORRY", body: "we couldn't find that page" }
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setMessage(randomMsg);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center p-8 text-center text-[#0F1111]">
                <Link href="/">
                    <div className="relative w-64 h-64 md:w-96 md:h-96 mb-6 cursor-pointer hover:scale-105 transition-transform duration-300">
                        <Image
                            src={catImage}
                            alt="Looking for something?"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                <h1 className="text-[#c45500] text-4xl md:text-5xl font-extrabold mb-4 tracking-wide">
                    {message.title}
                </h1>

                <p className="text-xl md:text-2xl font-medium mb-6 max-w-2xl">
                    {message.body}
                </p>

                <p className="text-md mb-8 text-[#565959]">
                    Try searching or go to <Link href="/" className="text-[#007185] hover:text-[#c45500] hover:underline font-semibold">Amozun's home page</Link>.
                </p>

                <Link
                    href="/"
                    className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] rounded-full py-2.5 px-10 text-[15px] font-bold shadow-sm transition-colors text-[#0F1111]"
                >
                    Return to Homepage
                </Link>
            </main>
            <Footer />
        </div>
    );
}
