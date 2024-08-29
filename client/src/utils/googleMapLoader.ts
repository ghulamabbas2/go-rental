import { Libraries, Loader } from "@googlemaps/js-api-loader";

const libraries: Libraries = ["places", "maps"];

const loadGoogleMapsApi = () => {
  const loader = new Loader({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  return loader.load();
};

export default loadGoogleMapsApi;
