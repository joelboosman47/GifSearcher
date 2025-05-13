import { ImagePlay } from "lucide-react";

const Header = () => {
  return (
    <header className="mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-dark flex items-center">
          <span className="text-primary">GIF</span>inder
          <ImagePlay className="ml-2 text-primary h-6 w-6" />
        </h1>
        <div className="hidden md:block">
          <button className="text-sm bg-white rounded-full py-1 px-3 shadow text-dark hover:shadow-md transition-shadow">
            <span className="text-sm align-text-bottom mr-1">?</span>
            Help
          </button>
        </div>
      </div>
      <p className="text-gray-600 mt-1">Find, copy & share the perfect GIF in seconds</p>
    </header>
  );
};

export default Header;
