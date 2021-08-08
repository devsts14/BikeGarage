import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
const CarouselMain = () => {
    return (
        <Carousel autoPlay showThumbs={false} showStatus={false}>
      <div>
        <img src="/carousel-1.png" />
      </div>
      <div>
        <img src="/carousel-2.png" />
      </div>
      <div>
        <img src="/carousel-3.png" />
      </div>
    </Carousel>
    )
}

export default CarouselMain
