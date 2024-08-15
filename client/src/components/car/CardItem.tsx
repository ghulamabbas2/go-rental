import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
import { CarFront, CircleDot, MoveRight } from "lucide-react";
import { ICar } from "@go-rental/shared";
import StarRatings from "react-star-ratings";

type Props = {
  car: ICar;
};

const CardItem = ({ car }: Props) => {
  return (
    <Card className="m-2 my-4">
      <div className="flex items-center bg-white shadow-md rounded-lg">
        <div className="w-48 h-48">
          {car?.images[0]?.url ? (
            <img
              src={car?.images[0]?.url}
              alt="Car thumbnail"
              className="w-full h-full object-cover"
            />
          ) : (
            <CarFront color="#e3e3e3" className="h-full w-full" />
          )}
        </div>
        <div className="px-3 flex-1">
          <Link to={`/car/${car?.id}`}>
            <h3 className="text-2xl font-bold text-gray-900">{car?.name}</h3>
          </Link>
          <div className="mt-1 mb-3">
            <Badge variant="outline" className="text-gray-600">
              <CircleDot className="h-2 w-2 me-1" />
              {car?.category}
            </Badge>
            <Badge variant="outline" className="ms-2 text-gray-600">
              <CircleDot className="h-2 w-2 me-1" /> {car?.fuelType}
            </Badge>
            <Badge variant="outline" className="ms-2 text-gray-600">
              <CircleDot className="h-2 w-2 me-1" /> {car?.transmission}
            </Badge>
          </div>
          <div className="flex items-center my-2">
            <StarRatings
              rating={car.ratings.value}
              starRatedColor="orange"
              numberOfStars={5}
              name="rating"
              starDimension="22px"
              starSpacing="1px"
            />
            <p className="ms-2 text-sm font-bold text-gray-900 dark:text-white">
              {car?.ratings?.value}
            </p>
            <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
            <p className="text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white">
              {car?.ratings?.count} reviews
            </p>
          </div>
          <div className="flex items-center justify-between mt-6">
            <span className="text-xl font-bold text-gray-900">
              ${car?.rentPerDay}{" "}
              <p className="text-xs font-thin text-gray-700 ms-1">
                rent per day
              </p>
            </span>
            <Button size="sm" className="px-4" asChild>
              <Link to={`/car/${car?.id}`}>
                Book Now <MoveRight className="ml-3 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CardItem;
