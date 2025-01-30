import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Redirect to the home page
  };

  return (
    <div className="container mx-auto max-h-screen">
      <Card className="flex flex-col items-center justify-center text-center p-6">
        <CardHeader className="text-4xl font-bold text-red-600">404</CardHeader>
        <CardDescription className="text-xl mt-4">
          Oops! The page you're looking for doesn't exist.
        </CardDescription>
        <CardFooter>
          <Button
            onClick={handleGoHome}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Go Back Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;
