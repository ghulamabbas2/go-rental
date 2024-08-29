import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ArrowRightLeft, HandCoins } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import LocationSearch from "../map/LocationSearch";
import { CarDatePicker } from "../booking/CarDatePicker";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useNavigate } from "react-router-dom";
import { buildQueryString } from "src/utils/helpers";

const Search = () => {
  const [location, setLocation] = useState<string>("");
  const [dates, setDates] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [budget, setBudget] = useState<string>("");

  const navigate = useNavigate();

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const queryString = buildQueryString({
      location,
      startDate: dates?.from,
      endDate: dates?.to,
      budget,
    });

    const url = queryString ? `/?${queryString}` : "/";
    navigate(url);
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Search Your Rental Car</CardTitle>
            <CardDescription>
              Enter your details below to find the best deals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mx-auto grid w-[450px] gap-6 mt-5">
              <form onSubmit={submitHandler}>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="location">Pick Up Location</Label>
                    <LocationSearch
                      onLocationChanged={(value) => setLocation(value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="dates">Select Dates</Label>
                    </div>
                    <CarDatePicker onDateChange={(dates) => setDates(dates)} />
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="budget">Budget Per Day (Optional)</Label>
                    <div className="relative flex-1 md:grow-0">
                      <HandCoins className="absolute left-4 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="50"
                        className="w-full rounded-lg bg-background pl-10"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full mt-5">
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Find Best Deals
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="/images/search-car.jpg"
          alt="banner"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale opacity-70"
        />
      </div>
    </div>
  );
};

export default Search;
