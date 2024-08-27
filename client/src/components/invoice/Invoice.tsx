import React, { useEffect } from "react";
import "./invoice.css";
import { Button } from "../ui/button";
import { CarTaxiFront, ReceiptText } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_BOOKING_BY_ID } from "src/graphql/queries/booking.queries";
import LoadingSpinner from "../layout/LoadingSpinner";
import NotFound from "../layout/NotFound";
import { errorToast, parseTimestampDate } from "src/utils/helpers";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Invoice = () => {
  const params = useParams();

  const { data, loading, error } = useQuery(GET_BOOKING_BY_ID, {
    variables: { bookingId: params?.id },
  });

  const booking = data?.getBookingById;

  useEffect(() => {
    if (error) errorToast(error);
  }, [error]);

  const handleInvoiceDownload = () => {
    const input = document.getElementById("order_invoice");
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF();

        const width = pdf.internal.pageSize.getWidth();
        pdf.addImage(imgData, "PNG", 0, 0, width, 0);
        pdf.save(`invoice-${booking?.id}.pdf`);
      });
    }
  };

  if (loading) {
    return <LoadingSpinner size={60} fullScreen={true} />;
  }

  if (error?.graphQLErrors[0]?.extensions?.code === "NOT_FOUND") {
    return <NotFound />;
  }

  return (
    <div className="container my-10">
      <div className="invoice mt-10">
        <div className="flex justify-end">
          <Button className="ml-2 mx-10 mb-10" onClick={handleInvoiceDownload}>
            <ReceiptText className="mr-2 h-4 w-4" /> Download Invoice
          </Button>
        </div>
        <div className="px-10 py-5" id="order_invoice">
          <header className="clearfix">
            <div id="logo">
              <CarTaxiFront className="h-20 w-20" />
            </div>
            <div id="company">
              <h2 className="name">Go Rental</h2>
              <div>455 Foggy Heights, AZ 85004, US</div>
              <div>(602) 519-0450</div>
              <div>
                <a href="mailto:company@example.com">support@gorental.com</a>
              </div>
            </div>
          </header>
          <main>
            <div id="details" className="clearfix">
              <div id="client">
                <div className="to">INVOICE TO:</div>
                <h2 className="name">{booking?.customer?.name}</h2>
                <h2 className="Phone">{booking?.customer?.phoneNo}</h2>
                <div className="email">
                  <a href={`mailto:${booking?.customer?.email}`}>
                    {booking?.customer?.email}
                  </a>
                </div>
                <div>{booking?.paymentInfo?.status?.toUpperCase()}</div>
              </div>
              <div id="invoice">
                <h1>INVOICE #</h1>
                <p className="text-2xl mb-10">{booking?.id}</p>
                <div className="date">
                  Booking Date: {parseTimestampDate(booking?.createdAt)}
                </div>
              </div>
            </div>
            <table style={{ border: "none", borderSpacing: "0", padding: "0" }}>
              <thead>
                <tr>
                  <th className="no">CAR DETAILS</th>
                  <th className="desc">CAR RENTAL DURATION</th>
                  <th className="unit">RENT PER DAY</th>
                  <th className="qty">DAYS OF RENT</th>
                  <th className="total">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="no">{booking?.car?.name}</td>
                  <td className="desc">
                    <div>
                      <h3>Start Date:</h3>
                      {parseTimestampDate(booking?.startDate)}
                    </div>
                    <div className="mt-5">
                      <h3>End Date:</h3>
                      {parseTimestampDate(booking?.endDate)}
                    </div>
                  </td>
                  <td className="unit">${booking?.rentPerDay}</td>
                  <td className="qty">{booking?.daysOfRent}</td>
                  <td className="total">${booking?.amount?.rent}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}></td>
                  <td colSpan={2}>RENT</td>
                  <td>${booking?.amount?.rent}</td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <td colSpan={2}>DISCOUNT</td>
                  <td>${booking?.amount?.discount}</td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <td colSpan={2}>TAX 15%</td>
                  <td>${booking?.amount?.tax}</td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <td colSpan={2}>GRAND TOTAL</td>
                  <td>${booking?.amount?.total}</td>
                </tr>
              </tfoot>
            </table>
            <div id="notices">
              <div>Customer Additional Notes:</div>
              <div className="notice">
                {booking?.additionalNotes
                  ? booking?.additionalNotes
                  : "No additional notes"}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
