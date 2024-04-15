import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// import required modules
import { Pagination, Navigation } from 'swiper/modules';
const Carrousel = ({value}) => {
    return (
    <>
      <Swiper
        pagination={{
          type: 'fraction',
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>{value}</SwiperSlide>
        <SwiperSlide>{value}</SwiperSlide>
        <SwiperSlide>{value}</SwiperSlide>
        <SwiperSlide>{value}</SwiperSlide>
      </Swiper>
    </>
    )
}

export default Carrousel;