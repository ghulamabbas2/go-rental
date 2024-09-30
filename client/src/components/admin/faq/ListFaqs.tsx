import React, { useEffect } from "react";
import AdminLayout from "../AdminLayout";

import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  errorToast,
  errorWrapper,
  parseTimestampDate,
} from "src/utils/helpers";
import { useMutation, useQuery } from "@apollo/client";
import { Trash2 } from "lucide-react";

import { IFaq } from "@go-rental/shared";
import LoadingSpinner from "src/components/layout/LoadingSpinner";
import { GET_ALL_FAQS } from "src/graphql/queries/faq.queries";
import { FaqDialog } from "./FaqDialog";
import { DELETE_FAQ_MUTATION } from "src/graphql/mutations/faq.mutations";

const ListFaqs = () => {
  const { error, data, loading, refetch } = useQuery(GET_ALL_FAQS);

  const faqs = data?.getAllFaqs;

  const [deleteFaq, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_FAQ_MUTATION, {
      onCompleted: () => {
        refetch();
      },
    });

  useEffect(() => {
    if (error) errorToast(error);

    if (deleteError) errorToast(deleteError);
  }, [error, deleteError]);

  const deleteFaqHandler = async (id: string) => {
    await errorWrapper(async () => {
      await deleteFaq({
        variables: { faqId: id },
      });
    });
  };

  return (
    <AdminLayout>
      {loading ? (
        <LoadingSpinner fullScreen={true} size={60} />
      ) : (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              <Card>
                <CardHeader className="flex flex-col md:flex-row mb-4">
                  <div className="flex-1">
                    <CardTitle>FAQs</CardTitle>
                    <CardDescription>
                      View and manage all FAQs in the system
                    </CardDescription>
                  </div>
                  <div className="relative ml-auto flex-1 md:grow-0">
                    <FaqDialog refetchFaqs={refetch} />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          ID
                        </TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead>Answer</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Created At
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {faqs?.map((faq: IFaq) => (
                        <TableRow key={faq?.id}>
                          <TableCell className="hidden sm:table-cell">
                            {faq?.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            {faq?.question}
                          </TableCell>
                          <TableCell className="font-medium">
                            {faq?.answer}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {parseTimestampDate(faq?.createdAt)}
                          </TableCell>
                          <TableCell className="w-[120px]">
                            <FaqDialog
                              updateFaqData={faq}
                              refetchFaqs={refetch}
                            />
                            <Button
                              variant="destructive"
                              className="ms-2"
                              size="icon"
                              disabled={deleteLoading}
                              onClick={() => deleteFaqHandler(faq?.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ListFaqs;
