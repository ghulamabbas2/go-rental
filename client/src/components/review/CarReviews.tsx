import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ReviewDialog } from "./ReviewDialog";
import { IReview } from "@go-rental/shared";
import {
  findReviewByUserId,
  getUserNameInitials,
  parseTimestampDate,
} from "src/utils/helpers";
import StarRatings from "react-star-ratings";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "src/apollo/apollo-vars";

type Props = {
  carId: string;
  reviews: IReview[];
  canReview: boolean;
  refetchCar: () => void;
};

const CarReviews = ({ carId, reviews, canReview, refetchCar }: Props) => {
  const user = useReactiveVar(userVar);

  const currentUserReview = findReviewByUserId(reviews, user?.id!);

  return (
    <div>
      {(currentUserReview || canReview) && (
        <Card>
          <CardHeader className="bg-muted/25">
            <div className="grid gap-0.5">
              {currentUserReview ? (
                <>
                  <CardTitle className="group flex items-center gap-2 mb-5 text-2xl">
                    <p className="text-2xl font-bold">Your Review</p>
                    <ReviewDialog
                      buttonText={"Update Your Review"}
                      carId={carId}
                      review={currentUserReview}
                      refetchCar={refetchCar}
                    />
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    <div className="px-2">
                      <div className="flex my-5">
                        <Avatar className="h-20 w-20">
                          <AvatarImage
                            src={currentUserReview?.user?.avatar?.url}
                          />
                          <AvatarFallback>
                            {getUserNameInitials(currentUserReview?.user?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ms-4">
                          <h3 className="text-xl font-black">
                            {currentUserReview?.user?.name}
                          </h3>
                          <p className="mb-3">
                            Last Updated: {currentUserReview?.updatedAt}
                          </p>
                          <StarRatings
                            rating={currentUserReview?.rating}
                            starRatedColor="orange"
                            numberOfStars={5}
                            name="rating"
                            starDimension="25px"
                            starSpacing="1px"
                          />
                          <p className="mt-4 text-md font-semibold">
                            {currentUserReview?.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <CardTitle className="group flex items-center gap-2 mb-5 text-xl">
                  <Alert
                    variant="destructive"
                    className="flex justify-between items-center w-full"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <div>
                        <AlertTitle>You have not given any review</AlertTitle>
                        <AlertDescription>
                          You can give your review by clicking on the button
                          below
                        </AlertDescription>
                      </div>
                    </div>
                    <ReviewDialog
                      buttonText={"Post Your Review"}
                      carId={carId}
                      refetchCar={refetchCar}
                    />
                  </Alert>
                </CardTitle>
              )}
            </div>
          </CardHeader>
        </Card>
      )}

      {reviews?.length > 0 && (
        <Card className="mt-10">
          <CardHeader className="bg-muted/25">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 mb-5 text-2xl">
                <p className="text-2xl font-bold mt-5">
                  {reviews?.length} Reviews
                </p>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                <div className="px-8">
                  {reviews?.map((review) => (
                    <div key={review?.id}>
                      <DropdownMenuSeparator />
                      <div className="flex my-5">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={review?.user?.avatar?.url} />
                          <AvatarFallback>
                            {getUserNameInitials(review?.user?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ms-4">
                          <h3 className="text-xl font-black">
                            {review?.user?.name}
                          </h3>
                          <p className="mb-3">
                            Last Updated:{" "}
                            {parseTimestampDate(review?.updatedAt)}
                          </p>
                          <StarRatings
                            rating={review?.rating}
                            starRatedColor="orange"
                            numberOfStars={5}
                            name="rating"
                            starDimension="25px"
                            starSpacing="1px"
                          />
                          <p className="mt-4 text-md font-semibold">
                            {review?.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default CarReviews;
