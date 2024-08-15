import { FacebookIcon, TwitterIcon, YoutubeIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="dark bg-gray-900 text-gray-200 py-6">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-sm">© 2024 Go Rental. All rights reserved.</p>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Link
            to="/"
            className="text-gray-400 hover:text-gray-100 transition-colors"
          >
            <YoutubeIcon className="h-6 w-6" />
            <span className="sr-only">YouTube</span>
          </Link>
          <Link
            to="/"
            className="text-gray-400 hover:text-gray-100 transition-colors"
          >
            <FacebookIcon className="h-6 w-6" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link
            to="/"
            className="text-gray-400 hover:text-gray-100 transition-colors"
          >
            <TwitterIcon className="h-6 w-6" />
            <span className="sr-only">Twitter</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
