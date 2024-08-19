import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <img src="/images/404.png" alt="404" height={400} width={400} />
      <p className="text-xl">
        Go back to{" "}
        <b>
          <Link to="/" className="text-blue-500">
            HomePage
          </Link>
        </b>
      </p>
    </div>
  );
};

export default NotFound;
