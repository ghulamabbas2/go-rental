import AdminLayout from "../AdminLayout";
import { ChevronLeft, Upload, X } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewUpdateCarSchema } from "../../../zod-schemas/car.schemas";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import LocationSearch from "src/components/map/LocationSearch";
import {
  CarBrand,
  CarCategories,
  CarDoors,
  CarFuelTypes,
  CarSeats,
  CarStatus,
  CarTransmissions,
} from "@go-rental/shared";
import { useMutation } from "@apollo/client";
import { CREATE_CAR_MUTATION } from "src/graphql/mutations/car.mutations";
import { errorToast, errorWrapper } from "src/utils/helpers";
import LoadingSpinner from "src/components/layout/LoadingSpinner";

const NewCar = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);

  const [createCar, { loading, error }] = useMutation(CREATE_CAR_MUTATION, {
    onCompleted: () => {
      navigate("/admin/cars");
    },
  });

  useEffect(() => {
    if (error) errorToast(error);
  }, [error]);

  const form = useForm<z.infer<typeof NewUpdateCarSchema>>({
    resolver: zodResolver(NewUpdateCarSchema),
  });

  async function handleSubmit(data: z.infer<typeof NewUpdateCarSchema>) {
    const carInput = {
      ...data,
      doors: parseInt(data.doors),
      seats: parseInt(data.seats),
      images,
    };

    await errorWrapper(async () => {
      await createCar({
        variables: { carInput },
      });
    });
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files && Array.from(e.target.files);

    files?.forEach((file: File) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((prevArr) => [...prevArr, reader.result as string]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleImagePreviewDeletion = (image: string) => {
    const filteredImagesPreview = images.filter((img) => img !== image);
    setImages(filteredImagesPreview);
  };

  const handleResetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <AdminLayout>
      <div className="flex min-h-screen w-full flex-col bg-muted/40 my-5">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                  <div className="flex items-center gap-4">
                    <Link to={"/admin/cars"}>
                      <Button variant="outline" size="icon" className="h-7 w-7">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                      </Button>
                    </Link>
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                      Add a New Car
                    </h1>
                    <div className="items-center gap-2 ml-auto">
                      <Button className="w-[120px]" disabled={loading}>
                        {loading ? <LoadingSpinner /> : "Create Car"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8 my-5">
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                      <Card>
                        <CardHeader>
                          <CardTitle>Car Details</CardTitle>
                          <CardDescription>
                            Enter the rental car details below
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-6">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="rentPerDay"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Rent Per Day</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="50"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Enter description"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address</FormLabel>
                                  <FormControl>
                                    <LocationSearch
                                      onLocationChanged={(value) =>
                                        form.setValue("address", value)
                                      }
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Car Features / Specs</CardTitle>
                          <CardDescription>
                            Enter car features and specifications below
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-6">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="brand"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Brand</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select Car Brand" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {CarBrand?.map((value: string) => (
                                          <SelectItem key={value} value={value}>
                                            {value}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="transmission"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Transmission</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select Car Transmission" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {CarTransmissions?.map(
                                          (value: string) => (
                                            <SelectItem
                                              key={value}
                                              value={value}
                                            >
                                              {value}
                                            </SelectItem>
                                          )
                                        )}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="seats"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Seats</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select Car Seats" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {CarSeats?.map((value: number) => (
                                          <SelectItem
                                            key={value}
                                            value={value?.toString()}
                                          >
                                            {value}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="doors"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Doors</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select Car Doors" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {CarDoors?.map((value: number) => (
                                          <SelectItem
                                            key={value}
                                            value={value?.toString()}
                                          >
                                            {value}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="fuelType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Fuel Type</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select Car Fuel Type" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {CarFuelTypes?.map((value: string) => (
                                          <SelectItem key={value} value={value}>
                                            {value}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select Car Category" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {CarCategories?.map((value: string) => (
                                          <SelectItem key={value} value={value}>
                                            {value}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Further Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="milleage"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Milleage</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="3000"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="power"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Power (CC)</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="1800"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Year</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        placeholder="2015"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                      <Card>
                        <CardHeader>
                          <CardTitle>Car Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-6">
                            <div className="grid gap-3">
                              <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {CarStatus?.map((value: string) => (
                                          <SelectItem key={value} value={value}>
                                            {value}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="overflow-hidden">
                        <CardHeader>
                          <CardTitle>Car Images</CardTitle>
                          <CardDescription>
                            Select car images below to upload
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-2">
                            <div className="grid grid-cols-3 gap-2">
                              {images.map((image, index) => (
                                <div className="relative border" key={index}>
                                  <img
                                    alt="Car Images"
                                    className="aspect-square w-full rounded-md object-cover"
                                    height="84"
                                    src={image}
                                    width="84"
                                  />
                                  <span
                                    className="absolute top-0 right-0 p-1 bg-rose-700"
                                    onClick={() =>
                                      handleImagePreviewDeletion(image)
                                    }
                                  >
                                    <X color="white" className="h-4 w-4" />
                                  </span>
                                </div>
                              ))}
                              <div
                                className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <Upload className="h-4 w-4 text-muted-foreground" />
                                <span className="sr-only">Upload</span>
                              </div>

                              <Input
                                type="file"
                                multiple
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                onClick={handleResetFileInput}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </main>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewCar;
