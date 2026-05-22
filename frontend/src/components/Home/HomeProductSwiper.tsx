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
                    '--swiper-navigation-color': '#0F1111',
                    '--swiper-navigation-size': '20px',
                    '--swiper-navigation-sides-offset': '0px',
                }}
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id} className="h-auto">
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom CSS to style the navigation buttons like Amazon's square buttons */}
            <style jsx global>{`
                .products-swiper-home .swiper-button-next,
                .products-swiper-home .swiper-button-prev {
                    background-color: white;
                    width: 40px;
                    height: 100px;
                    border-radius: 4px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                    border: 1px solid #ddd;
                    top: 40%;
                }
                .products-swiper-home .swiper-button-next:after,
                .products-swiper-home .swiper-button-prev:after {
                    font-size: 20px;
                    font-weight: bold;
                }
                .products-swiper-home .swiper-button-disabled {
                    opacity: 0.3;
                    box-shadow: none;
                }
            `}</style>
        </div>
    );
}
