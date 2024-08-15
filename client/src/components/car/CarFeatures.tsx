import { Card, CardHeader, CardTitle } from "../ui/card";
import {
  BatteryFull,
  CalendarDays,
  CarFront,
  Cog,
  DoorClosed,
  Fuel,
  Milestone,
  RockingChair,
  Type,
} from "lucide-react";
import { Button } from "../ui/button";
import { ICar } from "@go-rental/shared";

interface Props {
  car: ICar;
}

const CarFeatures = ({ car }: Props) => {
  const features = [
    { name: car?.brand, icon: CarFront },
    { name: car?.category, icon: Type },
    { name: car?.fuelType, icon: Fuel },
    { name: car?.transmission, icon: Cog },
    { name: `${car?.power} CC`, icon: BatteryFull },
    { name: car?.year, icon: CalendarDays },
    { name: `${car?.milleage} KM`, icon: Milestone },
    { name: `${car?.doors} Doors`, icon: DoorClosed },
    { name: `${car?.seats} Seats`, icon: RockingChair },
  ];

  return (
    <Card>
      <CardHeader className="bg-muted/25">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 mb-5 text-2xl">
            <p className="text-2xl font-bold mt-5">Key Features</p>
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            <div className="px-8">
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-start">
                {features?.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-xl"
                  >
                    <Button
                      variant="secondary"
                      size="icon"
                      className="rounded-full"
                    >
                      <feature.icon className="h-6 w-6" />
                    </Button>
                    <p>{feature?.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default CarFeatures;
