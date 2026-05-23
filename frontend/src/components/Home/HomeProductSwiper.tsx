'use client'

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from "./ProductCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

interface HomeProductSwiperProps {
    title: string;
    products: any[];
}

export default function HomeProductSwiper({ title, products }: HomeProductSwiperProps) {
    if (!products || products.length === 0) return null;

    return (
        <div className="z-10 flex flex-col bg-white h-auto mb-5 mx-4 p-4 border border-gray-200">
            <h2 className="text-xl font-bold text-[#0F1111] mb-4">
                {title}
            </h2>

            <Swiper
                slidesPerView={2}
                spaceBetween={10}
                slidesPerGroup={2}
                navigation={true}
                modules={[Navigation]}
                className="w-full products-swiper-home h-full"
                breakpoints={{
                    640: {
                        slidesPerView: 3,
                        slidesPerGroup: 3
                    },
                    768: {
                        slidesPerView: 4,
                        slidesPerGroup: 4
                    },
                    1024: {
                        slidesPerView: 5,
                        slidesPerGroup: 5
                    },
                    1280: {
                        slidesPerView: 6,
                        slidesPerGroup: 6
                    }
                }}
                style={{
                    // @ts-ignore
                    '--swiper-navigation-color': '#333',
                    '--swiper-navigation-size': '2rem',
                    '--swiper-navigation-sides-offset': '10px',
                }}
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id} className="h-auto">
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom CSS to style the navigation buttons */}
            <style jsx global>{`
                .products-swiper-home .swiper-button-next,
                .products-swiper-home .swiper-button-prev {
                    display: none; /* Hidden on mobile */
                }
                
                @media (min-width: 768px) {
                    .products-swiper-home .swiper-button-next,
                    .products-swiper-home .swiper-button-prev {
                        display: flex;
                        transition: opacity 0.2s ease, transform 0.2s ease;
                        opacity: 0.8;
                    }
                    
                    .products-swiper-home .swiper-button-next:hover,
                    .products-swiper-home .swiper-button-prev:hover {
                        opacity: 1;
                        transform: scale(1.1);
                    }
                    
                    .products-swiper-home .swiper-button-disabled {
                        opacity: 0; /* Fully hide disabled buttons for a cleaner look */
                        pointer-events: none;
                    }
                }
            `}</style>
        </div>
    );
}
