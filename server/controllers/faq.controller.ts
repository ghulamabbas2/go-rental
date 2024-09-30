import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import Faq from "../models/faq.model";
import { FaqInput } from "../types/faq.types";

export const getAllFaqs = catchAsyncErrors(async () => {
  const faqs = await Faq.find();

  return faqs;
});

export const createFaq = catchAsyncErrors(
  async (faqInput: FaqInput, userId: string) => {
    const faq = await Faq.create({
      ...faqInput,
      user: userId,
    });

    return faq;
  }
);

export const updateFaq = catchAsyncErrors(
  async (faqId: string, faqInput: FaqInput) => {
    const faq = await Faq.findByIdAndUpdate(faqId, faqInput, { new: true });

    if (!faq) throw new Error("Faq not found");

    return faq;
  }
);

export const deleteFaq = catchAsyncErrors(async (faqId: string) => {
  const faq = await Faq.findById(faqId);

  if (!faq) throw new Error("Faq not found");

  await faq.deleteOne();

  return true;
});
