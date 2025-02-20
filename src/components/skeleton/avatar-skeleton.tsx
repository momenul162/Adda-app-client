import { Skeleton } from "../ui/skeleton";

export const AvatarSkeletonFull = () => {
  return <Skeleton className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gray-300" />;
};

export const AvatarSkeletonMid = () => {
  return (
    <Skeleton className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-28 h-28 rounded-full bg-gray-300" />
  );
};

export const AvatarSkeleton = () => {
  return <Skeleton className="w-11 h-11 rounded-full bg-gray-300" />;
};

export const CoverSkeleton = () => {
  return <Skeleton className="h-32 md:h-48 w-full bg-gray-300" />;
};

export const CoverSkeletonMid = () => {
  return <Skeleton className="h-28 w-full bg-gray-300" />;
};

export const FriendListSkeleton = () => {
  return (
    <div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  );
};
