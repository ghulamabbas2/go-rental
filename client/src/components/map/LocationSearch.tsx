import { useJsApiLoader } from "@react-google-maps/api";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { MapPin, MapPinned } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import usePlacesAutocomplete from "use-places-autocomplete";

const PlacesAutocomplete = () => {
  const [open, setOpen] = useState(false);
  const [locationValue, setLocationValue] = useState("");

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete({});

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full flex justify-between items-center"
          >
            <MapPinned className="h-4 w-4 shrink-0 opacity-50 mr-2" />
            <span className="flex-grow text-left truncate">
              {locationValue ? locationValue : "Select location ..."}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px] p-0">
          <Command>
            <CommandInput
              placeholder="Search Location..."
              value={value}
              onValueChange={setValue}
              disabled={!ready}
            />
            <CommandList>
              <CommandEmpty>No location found.</CommandEmpty>
              <CommandGroup>
                {status === "OK" &&
                  data?.map(({ place_id, description }) => (
                    <CommandItem
                      key={place_id}
                      value={description}
                      onSelect={(currenValue) => {
                        setLocationValue(currenValue);
                        setOpen(false);
                      }}
                    >
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center flex-grow">
                          <MapPin className="h-4 w-4 flex-shrink-0 mr-2" />
                          <span className="flex-grow">{description}</span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const LocationSearch = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  return <div>{isLoaded ? <PlacesAutocomplete /> : <div>Loading...</div>}</div>;
};

export default LocationSearch;
