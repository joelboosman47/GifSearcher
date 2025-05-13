import { ImagePlay, Heart } from "lucide-react";
import { Link, useLocation } from "wouter";

const Header = () => {
  const [location] = useLocation();
  const isHomePage = location === "/";
  
  return (
    <header className="mb-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <a className="cursor-pointer">
            <h1 className="text-2xl font-semibold text-dark flex items-center">
              <span className="text-primary">GIF</span>inder
              <ImagePlay className="ml-2 text-primary h-6 w-6" />
            </h1>
          </a>
        </Link>
        <div className="flex items-center space-x-3">
          {isHomePage ? (
            <Link href="/favorites">
              <a className="bg-white text-dark hover:bg-gray-50 transition-colors rounded-full py-1.5 px-3 shadow hover:shadow-md flex items-center">
                <Heart className="h-4 w-4 text-primary mr-1.5" />
                <span className="text-sm">Favorites</span>
              </a>
            </Link>
          ) : (
            <Link href="/">
              <a className="bg-white text-dark hover:bg-gray-50 transition-colors rounded-full py-1.5 px-3 shadow hover:shadow-md flex items-center">
                <span className="text-sm">Search</span>
              </a>
            </Link>
          )}
        </div>
      </div>
      <p className="text-gray-600 mt-1">Find, copy & share the perfect GIF in seconds</p>
    </header>
  );
};

export default Header;
