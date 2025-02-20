import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const VideoCardSkeleton = () => {
  return (
    <div>
      {[...Array(2)].map((_, index) => (
        <Card key={index} className="my-4 px-auto mx-auto shadow-lg max-w-4xl border bg-gray-200">
          <CardHeader className="flex justify-between items-center p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-10 h-10 rounded-full bg-gray-300" />
              <div>
                <Skeleton className="w-24 h-4 mb-1" />
                <Skeleton className="w-16 h-3" />
              </div>
            </div>
            <Skeleton className="w-6 h-6 bg-gray-300" />
          </CardHeader>
          <CardContent className="p-4">
            <Skeleton className="w-full h-20 mb-2 bg-gray-300" />
            <Skeleton className="w-full h-60 rounded-md bg-gray-300" />
          </CardContent>
          <CardFooter className="flex justify-between p-4 border-t">
            <div className="flex space-x-4">
              <Skeleton className="w-16 h-8 rounded-md bg-gray-300" />
              <Skeleton className="w-16 h-8 rounded-md bg-gray-300" />
              <Skeleton className="w-16 h-8 rounded-md bg-gray-300" />
            </div>
            <Skeleton className="w-16 h-8 rounded-md bg-gray-300" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
