import Stripe from "stripe";
import catchAsyncErrors from "../middlewares/catchAsyncErrors";
import Booking from "../models/booking.model";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripeCheckoutSession = catchAsyncErrors(
  async (bookingId: string) => {
    const booking = await Booking.findById(bookingId).populate("car");

    if (!booking) {
      throw new Error("Booking not found");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${process.env.FRONTEND_URL}/me/bookings`,
      cancel_url: `${process.env.FRONTEND_URL}/car/${booking.car.id}`,
      client_reference_id: booking.id,
      customer_email: booking.customer.email,
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: booking.amount.total * 100,
            product_data: {
              name: booking.car.name,
              description: booking.car.description,
              images: [booking.car.images[0].url],
            },
          },
          quantity: 1,
        },
      ],
    });

    return { url: session?.url };
  }
);

export const webhookHandler = catchAsyncErrors(
  async (signature: string, rawBody: string) => {
    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const bookingId = session.client_reference_id;

        const paymentInfo = {
          id: session.payment_intent,
          status: session.payment_status,
          method: session.payment_method_types[0],
        };

        await Booking.findByIdAndUpdate(bookingId, {
          paymentInfo,
        });

        return true;
      }
    } catch (error) {
      console.log("Error in stripe webhook", error);
      throw new Error("Error in stripe webhook");
    }
  }
);
