const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gradient-to-r from-gray-600 to-gray-900 py-2 md:py-4 mt-10">
      {/* Flexbox for layout */}
      <div className="container mx-auto text-center">
        <p className="text-gray-300">All rights reserved ADDA Authority. &copy; {currentYear}</p>
        <p className="text-gray-400 text-sm mt-2">Crafted with ❤️ in Rajshahi</p>
      </div>
    </footer>
  );
};

export default Footer;
