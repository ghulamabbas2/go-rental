import { IFaq } from "@go-rental/shared";
import mongoose, { Schema } from "mongoose";

const faqSchema = new Schema<IFaq>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Faq = mongoose.model<IFaq>("Faq", faqSchema);
export default Faq;
