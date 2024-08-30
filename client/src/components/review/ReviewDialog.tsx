import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { errorToast, errorWrapper } from "src/utils/helpers";
import { CREATE_UPDATE_REVIEW_MUTATION } from "src/graphql/mutations/review.mutations";
import { useMutation } from "@apollo/client";
import LoadingSpinner from "../layout/LoadingSpinner";
import StarRatings from "react-star-ratings";
import { IReview } from "@go-rental/shared";

type Props = {
  buttonText: string;
  carId: string;
  review?: IReview;
  refetchCar: () => void;
};

export function ReviewDialog({ buttonText, carId, review, refetchCar }: Props) {
  const [rating, setRating] = useState(review?.rating || 0);
  const [comment, setComment] = useState(review?.comment || "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [createUpdateReview, { loading, error }] = useMutation(
    CREATE_UPDATE_REVIEW_MUTATION,
    {
      onCompleted: () => {
        setIsDialogOpen(false);
        refetchCar();
      },
    }
  );

  useEffect(() => {
    if (error) errorToast(error);
  }, [error]);

  const submitHandler = async () => {
    const reviewInput = {
      rating,
      comment,
      car: carId,
    };

    await errorWrapper(async () => {
      await createUpdateReview({
        variables: { reviewInput },
      });
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{buttonText}</DialogTitle>
          <DialogDescription>
            Post or update your review for this car
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-7 py-4">
          <div className="grid w-full gap-3">
            <Label htmlFor="message">Your Ratings</Label>
            <StarRatings
              rating={rating}
              starRatedColor="orange"
              numberOfStars={5}
              name="rating"
              starDimension="30px"
              starSpacing="1px"
              changeRating={(newRating: number) => setRating(newRating)}
            />
          </div>
          <div className="grid w-full gap-2">
            <Label htmlFor="comments">Your comments</Label>
            <Textarea
              placeholder="Type your review here."
              id="comments"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submitHandler} disabled={loading}>
            {loading ? <LoadingSpinner /> : buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
