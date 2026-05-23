'use client'

import { useState } from "react";
import Image from "next/image";

interface ProductImage {
    id: string;
    url: string;
    display_order: number;
    is_primary: boolean;
}

interface ProductGalleryProps {
    images: ProductImage[];
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    const defaultImage = images.find(img => img.is_primary)?.url || images[0]?.url || "";
    const [mainImage, setMainImage] = useState(defaultImage);

    return (
        <div className="flex flex-col md:flex-row gap-4 h-full sticky top-4">
            {/* Thumbnails (Left side on desktop, bottom/hidden on mobile) */}
            <div className="hidden md:flex flex-col gap-2 w-[50px] shrink-0">
                {images.map((img, index) => (
                    <div
                        key={img.id || index}
                        className={`border-2 rounded-sm overflow-hidden cursor-pointer h-[50px] w-[50px] flex items-center justify-center p-1 ${mainImage === img.url ? 'border-[#007185] shadow-[0_0_3px_#007185]' : 'border-gray-200 hover:border-[#007185]'}`}
                        onMouseEnter={() => setMainImage(img.url)}
                        onClick={() => setMainImage(img.url)}
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={img.url}
                                alt={`${productName} thumbnail ${index + 1}`}
                                fill
                                sizes="50px"
                                className="object-contain"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Image */}
            <div className="flex-grow relative h-[300px] sm:h-[400px] md:h-[500px] w-full flex items-center justify-center">
                {mainImage ? (
                    <Image
                        src={mainImage}
                        alt={productName}
                        fill
                        sizes="(max-width: 768px) 100vw, 500px"
                        className="object-contain"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                        No image available
                    </div>
                )}
            </div>

            {/* Mobile Thumbnails */}
            <div className="flex md:hidden gap-2 w-full overflow-x-auto pb-2">
                {images.map((img, index) => (
                    <div
                        key={img.id || index}
                        className={`border-2 rounded-sm overflow-hidden cursor-pointer h-[50px] min-w-[50px] flex items-center justify-center p-1 ${mainImage === img.url ? 'border-[#007185] shadow-[0_0_3px_#007185]' : 'border-gray-200'}`}
                        onClick={() => setMainImage(img.url)}
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={img.url}
                                alt={`${productName} thumbnail ${index + 1}`}
                                fill
                                sizes="50px"
                                className="object-contain"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
