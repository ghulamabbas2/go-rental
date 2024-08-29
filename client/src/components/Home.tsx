import Filters from "./layout/Filters";
import { useQuery } from "@apollo/client";
import ListHomeCars from "./car/ListHomeCars";
import { GET_ALL_CARS } from "src/graphql/queries/car.queries";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

import { errorToast } from "src/utils/helpers";

import HomeMap from "./map/HomeMap";
import LoadingSpinner from "./layout/LoadingSpinner";

const Home = () => {
  let [searchParams] = useSearchParams();

  const query = searchParams.get("query");
  const page = parseInt(searchParams.get("page") || "1", 10);

  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const transmission = searchParams.get("transmission");

  const location = searchParams.get("location");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const budget = searchParams.get("budget");

  const filters = {
    status: "Active",
    ...(budget && { rentPerDay: { lte: parseInt(budget, 10) } }),
    ...(category && { category }),
    ...(brand && { brand }),
    ...(transmission && { transmission }),
  };

  const variables = {
    page,
    filters,
    query,
    location,
    dateFilters: { startDate, endDate },
  };

  const { data, loading, error } = useQuery(GET_ALL_CARS, { variables });

  useEffect(() => {
    if (error) errorToast(error);
  }, [error]);

  return (
    <main className="my-8 grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 md:grid-cols-6 lg:grid-cols-10 xl:grid-cols-10">
      <div className="md:col-span-2 lg:col-span-2 flex flex-col">
        <Filters />
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 md:col-span-4 lg:col-span-4 flex flex-col">
        <ListHomeCars
          cars={data?.getAllCars?.cars}
          loading={loading}
          pagination={data?.getAllCars?.pagination}
        />
      </div>
      <div className="md:col-span-6 lg:col-span-4 flex flex-col">
        <div className="flex items-center justify-center h-screen">
          {loading ? (
            <div className="flex items center justify-center h-screen">
              <LoadingSpinner fullScreen={true} size={60} />
            </div>
          ) : (
            location && <HomeMap cars={data?.getAllCars?.cars} />
          )}
        </div>

        {/* Google Map Component */}
      </div>
    </main>
  );
};

export default Home;
