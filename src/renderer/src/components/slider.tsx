import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React from "react";
import Slider from "react-slick";

function ImageCarousel({ images }): React.JSX.Element {
  const settings = {
    dots: true, // Показывать точки-индикаторы
    infinite: true, // Бесконечная прокрутка
    speed: 500, // Скорость перехода (мс)
    slidesToShow: 1, // Сколько показывать картинок за раз
    slidesToScroll: 1, // Сколько листать за раз
    autoplay: true, // Автоматическое перелистывание
    autoplaySpeed: 3000, // Интервал (мс)
    arrows: true, // Показывать стрелки
  };

  return (
    <Slider {...settings}>
      {images.map((img, index) => (
        <div key={index}>
          <img src={img} alt={`Slide ${index + 1}`} style={{ width: "100%", height: "auto" }} />
        </div>
      ))}
    </Slider>
  );
};

export default ImageCarousel;