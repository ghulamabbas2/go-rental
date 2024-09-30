import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { useEffect, useState } from "react";
import { errorToast, errorWrapper } from "src/utils/helpers";
import { useMutation } from "@apollo/client";
import LoadingSpinner from "../../layout/LoadingSpinner";
import { IFaq } from "@go-rental/shared";
import { Pencil } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateFaqSchema } from "src/zod-schemas/faq.schemas";
import {
  CREATE_FAQ_MUTATION,
  UPDATE_FAQ_MUTATION,
} from "src/graphql/mutations/faq.mutations";
import { toast } from "src/components/ui/use-toast";
import { Textarea } from "src/components/ui/textarea";

type Props = {
  updateFaqData?: IFaq;
  refetchFaqs: () => void;
};

export function FaqDialog({ updateFaqData, refetchFaqs }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof CreateFaqSchema>>({
    resolver: zodResolver(CreateFaqSchema),
    defaultValues: updateFaqData || { question: "", answer: "" },
  });

  const [createFaq, { loading: createLoading }] = useMutation(
    CREATE_FAQ_MUTATION,
    {
      onCompleted: () => {
        setIsDialogOpen(false);
        refetchFaqs();
        form.reset();
        toast({
          title: "FAQ created successfully",
        });
      },
    }
  );

  const [updateFaq, { loading: updateLoading }] = useMutation(
    UPDATE_FAQ_MUTATION,
    {
      onCompleted: () => {
        setIsDialogOpen(false);
        refetchFaqs();
      },
    }
  );

  const submitHandler = async (data: z.infer<typeof CreateFaqSchema>) => {
    const faqInput = {
      question: data.question,
      answer: data.answer,
    };

    if (updateFaqData?.id) {
      await errorWrapper(async () => {
        await updateFaq({
          variables: { faqId: updateFaqData.id, faqInput },
        });
      });
    } else {
      await errorWrapper(async () => {
        await createFaq({
          variables: { faqInput },
        });
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {updateFaqData ? (
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() => setIsDialogOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => setIsDialogOpen(true)}>Create New Faq</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)}>
            <DialogHeader>
              <DialogTitle>
                {updateFaqData ? "Edit FAQ" : "Create New Faq"}
              </DialogTitle>
              <DialogDescription>
                {updateFaqData
                  ? " Update FAQ details here"
                  : "Create New Faq here"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Question" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Answer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={createLoading || updateLoading}>
                {createLoading || updateLoading ? (
                  <LoadingSpinner />
                ) : updateFaqData ? (
                  "Update FAQ"
                ) : (
                  "Create FAQ"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
