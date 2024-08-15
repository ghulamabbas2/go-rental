import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

interface Props {
  images: Array<{ public_id: string; url: string }>;
}

export function CarImagesSlider({ images }: Props) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <div className="w-full px-4">
      <Carousel
        plugins={[plugin.current]}
        className="mx-5"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {images?.length === 0 ? (
            <CarouselItem>
              <div className="h-full w-full flex justify-center items-center">
                <Card>
                  <img
                    src="/images/default_car.png"
                    alt="Car"
                    className="object-cover rounded-lg"
                  />
                </Card>
              </div>
            </CarouselItem>
          ) : (
            images?.map((image, index) => (
              <CarouselItem key={index}>
                <div className="h-full w-full flex justify-center items-center">
                  <Card>
                    <img
                      src={image?.url}
                      alt="Car"
                      className="object-cover rounded-lg"
                    />
                  </Card>
                </div>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
