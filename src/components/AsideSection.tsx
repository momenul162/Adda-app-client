import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RootState } from "@/store";
import { useState } from "react";
import { useSelector } from "react-redux";

const AsideSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <aside className="mt-4 lg:border-x lg:h-screen lg:fixed">
      <div className="mb-6 max-w-2xl lg:max-w-sm">
        {/* Profile Section */}
        <Card className="mb-4 rounded-none shadow-sm border">
          <CardContent className="flex flex-col items-center text-center">
            <div className="relative w-full mb-10">
              {/* Background Banner */}
              <img
                src="https://cdn.pixabay.com/photo/2020/06/18/17/08/sunset-5314319_1280.jpg"
                alt="Background"
                className="w-full h-20 rounded-t-md object-cover"
              />
              {/* Profile Picture */}
              <img
                src={user?.photo}
                alt="Profile"
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-20 h-20 border-4 border-white rounded-full"
              />
            </div>
            {/* User Details */}
            <h3 className="text-lg font-bold">{user?.username}</h3>
            <p className="text-sm text-gray-500">
              Front-end Developer | JavaScript | React | Student at University of Rajshahi
            </p>
          </CardContent>
        </Card>
        <div className="px-4">
          {/* Collapsible Section */}
          <div
            className={`overflow-hidden transition-all duration-600 ease-in-out ${
              isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div>
              <h4 className="text-md font-bold mb-2">Recent</h4>
              <Separator className="my-2" />
              <ul className="space-y-2">
                {[
                  "Career Opportunity in Bangladesh",
                  "JavaScript",
                  "All things Javascript: JS, TypeScript",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="text-sm text-blue-600 cursor-pointer hover:underline hover:text-blue-800"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <h4 className="text-md font-bold mb-2">Groups</h4>
              <Separator className="my-2" />
              <ul className="space-y-2">
                {[
                  "Career Opportunity in Bangladesh",
                  "JavaScript",
                  "All things Javascript: JS, TypeScript",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="text-sm text-blue-600 cursor-pointer hover:underline hover:text-blue-800"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Toggle Button */}
          <button
            onClick={toggleExpand}
            className="mt-2 flex items-center justify-center w-full text-sm font-semibold text-gray-700 hover:underline"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AsideSection;
