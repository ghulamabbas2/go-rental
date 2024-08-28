import { ICar } from "@go-rental/shared";
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Card } from "../ui/card";
import { generateSvg } from "src/utils/helpers";

interface ICoordinates {
  id: string;
  lat: number;
  lng: number;
  price: string;
  carName: string;
  carImage: string;
}

const createMarkerIcon = (price: string) => {
  const priceTagSvg = generateSvg(price);
  return priceTagSvg;
};

type Props = {
  cars: ICar[];
};

const HomeMap = ({ cars }: Props) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<any>([]);

  const coordinates: ICoordinates[] = cars?.map((car) => ({
    id: car?.id,
    lat: car?.location?.coordinates[1],
    lng: car?.location?.coordinates[0],
    price: car?.rentPerDay ? car?.rentPerDay.toString() : "N/A",
    carName: car?.name,
    carImage: car?.images[0]?.url,
  }));

  const loadMap = () => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
      libraries: ["maps"],
    });

    loader.load().then(async () => {
      const { Map } = (await google.maps.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;

      const mapInstance = new Map(
        document.getElementById("map") as HTMLElement,
        {
          mapId: process.env.REACT_APP_GOOGLE_MAP_ID!,
        }
      );

      setMap(mapInstance);
    });
  };

  useEffect(() => {
    loadMap();
  }, []);

  useEffect(() => {
    if (map && coordinates?.length > 0) {
      if (coordinates?.length === 1) {
        map.setCenter({ lat: coordinates[0].lat, lng: coordinates[0].lng });
        map.setZoom(18);
      } else {
        const bounds = new window.google.maps.LatLngBounds();

        coordinates?.forEach((coordinate) => {
          bounds.extend({ lat: coordinate.lat, lng: coordinate.lng });
        });

        map.fitBounds(bounds);
      }
    }
  }, [map, coordinates]);

  useEffect(() => {
    async function renderMarkers() {
      await google.maps.importLibrary("marker");

      const parser = new DOMParser();
      markersRef.current.forEach((marker: any) => marker.setMap(null));
      markersRef.current = [];

      coordinates?.forEach((coordinate) => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: coordinate.lat, lng: coordinate.lng },
          content: parser.parseFromString(
            createMarkerIcon(coordinate?.price),
            "image/svg+xml"
          ).documentElement,
        });

        const infoWindow = new google.maps.InfoWindow();

        marker.addListener("click", () => {
          const content = `<div class="text-center" style="width: 200px;">
                            <img src=${coordinate?.carImage} alt="Car Name" class="border mb-3" style="width: 100%; height: auto;" />
                            <a href="/car/${coordinate?.id}" target="_blank" class="text-xl font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                ${coordinate?.carName} - $${coordinate?.price}
                            </a>
                            </div>`;

          infoWindow.close();
          infoWindow.setContent(content);
          infoWindow.open(marker.map, marker);
        });

        markersRef.current.push(marker);
      });
    }

    renderMarkers();
  }, [map, coordinates]);

  return (
    <Card className="w-full flex-1">
      <div id="map" className="h-full h-screen"></div>
    </Card>
  );
};

export default HomeMap;
