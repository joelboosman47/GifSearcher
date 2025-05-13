import { ImagePlay, Heart } from "lucide-react";
import { Link, useLocation } from "wouter";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [location] = useLocation();
  const isHomePage = location === "/";
  
  return (
    <header className="mb-6">
      <div className="flex items-center justify-between">
        <Link href="/">
            <h1 className="text-2xl font-semibold text-dark flex items-center cursor-pointer">
              <span className="text-primary">GIF</span>inder
              <ImagePlay className="ml-2 text-primary h-6 w-6" />
            </h1>
        </Link>
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          {isHomePage ? (
            <Link href="/favorites">
              <div className="bg-white dark:bg-gray-800 text-dark dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-full py-1.5 px-3 shadow hover:shadow-md flex items-center cursor-pointer">
                <Heart className="h-4 w-4 text-primary mr-1.5" />
                <span className="text-sm">Favorites</span>
              </div>
            </Link>
          ) : (
            <Link href="/">
              <div className="bg-white dark:bg-gray-800 text-dark dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-full py-1.5 px-3 shadow hover:shadow-md flex items-center cursor-pointer">
                <span className="text-sm">Search</span>
              </div>
            </Link>
          )}
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mt-1">Find, copy & share the perfect GIF in seconds</p>
    </header>
  );
};

export default Header;
