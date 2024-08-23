import React from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { CarImagesSlider } from "./CarImageSlider";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import { MapPin } from "lucide-react";
import { CarFaqs } from "./CarFaqs";
import { Badge } from "../ui/badge";
import { useQuery } from "@apollo/client";
import { GET_CAR_BY_ID } from "src/graphql/queries/car.queries";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";

// import { CustomBreadcrumb } from "../layout/BreadCrumbs";
import { BookingForm } from "../booking/BookingForm";
// import CarReviews from "../review/CarReviews";
import CarFeatures from "./CarFeatures";
import LoadingSpinner from "../layout/LoadingSpinner";
import NotFound from "../layout/NotFound";

const CarDetails = () => {
  const params = useParams();

  const { data, loading, error } = useQuery(GET_CAR_BY_ID, {
    variables: {
      carId: params?.id,
      getCarBookedDatesCarId2: params?.id,
    },
  });

  const car = data?.getCarById;
  const disabledDates = data?.getCarBookedDates;

  if (loading) {
    return <LoadingSpinner size={60} fullScreen={true} />;
  }

  if (error?.graphQLErrors[0]?.extensions?.code === "NOT_FOUND") {
    return <NotFound />;
  }

  return (
    <div className="container">
      <main className="my-8 grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-start bg-muted/25">
              <div className="grid gap-0.5">
                <CardTitle className="px-8 mb-5 text-xl">
                  <Badge variant="outline" className="flex py-2 text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    <p>{car?.address}</p>
                  </Badge>
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  <CarImagesSlider images={car?.images} />
                  <div className="px-8 mt-5">
                    <h1 className="text-3xl font-bold">{car?.name}</h1>

                    <p className="font-bold text-lg pt-2">
                      <span className="text-xl">${car?.rentPerDay}</span> / Day
                    </p>

                    <div className="flex items-center my-5">
                      <StarRatings
                        rating={car?.ratings.value}
                        starRatedColor="orange"
                        numberOfStars={5}
                        name="rating"
                        starDimension="25px"
                        starSpacing="1px"
                      />
                      <p className="ms-2 text-sm font-bold text-gray-900 dark:text-white">
                        {car?.ratings.value}
                      </p>
                      <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
                      <p className="text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white">
                        {car?.ratings.count} reviews
                      </p>
                    </div>

                    <DropdownMenuSeparator />
                    <p className="text-lg">{car?.description}</p>
                    <DropdownMenuSeparator />
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <CarFeatures car={car} />
          <CarFaqs />

          {/* <CarReviews /> */}
        </div>
        <div>
          <BookingForm
            carId={car?.id}
            rentPerDay={car?.rentPerDay}
            disabledDates={disabledDates}
          />
        </div>
      </main>
    </div>
  );
};

export default CarDetails;
