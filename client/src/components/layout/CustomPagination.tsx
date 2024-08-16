import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import ReactPaginate from "react-paginate";
import { useNavigate, useSearchParams } from "react-router-dom";
import { updateSearchParams } from "src/utils/helpers";

const PaginationItem = ({ label }: { label: string }) => (
  <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-1 pl-2.5">
    <span>{label === "right" && "Next"}</span>
    {label === "left" ? (
      <ChevronLeft className="h-4 w-4" />
    ) : (
      <ChevronRight className="h-4 w-4" />
    )}

    <span>{label === "left" && "Previous"}</span>
  </span>
);

type Props = {
  totalCount: number;
  resPerPage: number;
};

const CustomPagination = ({ totalCount, resPerPage }: Props) => {
  let [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const handlePageClick = ({ selected }: { selected: number }) => {
    const page = (selected + 1).toString();

    searchParams = updateSearchParams(searchParams, "page", page);
    const path = `${window.location.pathname}?${searchParams.toString()}`;
    navigate(path);
  };

  return (
    <div>
      <ReactPaginate
        className="mx-auto flex w-full justify-center items-center my-6"
        breakLabel={<Ellipsis />}
        initialPage={currentPage > 1 ? currentPage - 1 : undefined}
        nextLabel={<PaginationItem label="right" />}
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={Math.ceil(totalCount / resPerPage)}
        previousLabel={<PaginationItem label="left" />}
        renderOnZeroPageCount={null}
        containerClassName="flex flex-row items-center gap-1"
        pageLinkClassName="cursor-pointer w-100 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
        activeClassName="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10"
      />
    </div>
  );
};

export default CustomPagination;
