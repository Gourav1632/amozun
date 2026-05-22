'use client'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function HeroSlider() {
    // Some static Amazon-like hero images
    const images = [
        "https://images-eu.ssl-images-amazon.com/images/G/31/img22/CEPC/Dec/amazonspecial/BFCM25_GW_PC_Hero._CB775393558_.jpg",
        "https://images-eu.ssl-images-amazon.com/images/G/31/2025/GW/UNREC/PC/78268._CB785061629_.jpg",
        "https://images-eu.ssl-images-amazon.com/images/G/31/INSLGW/74._CB783716748_.jpg",
        "https://images-eu.ssl-images-amazon.com/images/G/31/2025/GW/UNREC/PC/78269._CB785061629_.jpg",
        "https://images-eu.ssl-images-amazon.com/images/G/31/img21/Books/May26/Desktop_tall_Hero_3000x1200_Books-for-SSC-UPSC--more_rec._CB762894798_.jpg"
    ];

    return (
        <div className="relative w-full max-w-[1500px] mx-auto">
            <Swiper
                modules={[Navigation, Autoplay, Pagination]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={true}
                className="h-[250px] sm:h-[300px] md:h-[400px] lg:h-[600px] w-full"
                style={{
                    // @ts-ignore - Swiper CSS variables
                    '--swiper-navigation-color': '#333',
                    '--swiper-navigation-size': '2rem',
                    '--swiper-navigation-sides-offset': '20px',
                    '--swiper-pagination-color': '#fff',
                    '--swiper-pagination-bullet-inactive-color': '#999',
                    '--swiper-pagination-bullet-inactive-opacity': '0.8',
                }}
            >
                {images.map((img, idx) => (
                    <SwiperSlide key={idx} className="relative w-full h-full">
                        {/* 
                          We use a gradient mask at the bottom to transition 
                          smoothly into the background color below the slider 
                        */}
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#eaeded] to-transparent h-full w-full pointer-events-none"
                            style={{ background: 'linear-gradient(to bottom, transparent 60%, #eaeded 100%)' }} />
                        <div className="relative w-full h-full">
                            <Image
                                src={img}
                                alt={`Hero Banner ${idx + 1}`}
                                fill
                                className="object-cover object-top"
                                priority={idx === 0}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            {/* Custom styled Navigation Buttons wrapper could go here if needed to strictly match Amazon */}
        </div>
    );
}
