import { Skeleton } from "../ui/skeleton";

export const AvatarSkeletonFull = () => {
  return <Skeleton className="w-32 h-32 rounded-full bg-gray-300" />;
};

export const AvatarSkeletonMid = () => {
  return (
    <Skeleton className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-20 h-20 rounded-full bg-gray-300" />
  );
};

export const AvatarSkeleton = () => {
  return <Skeleton className="w-11 h-11 rounded-full bg-gray-300" />;
};

export const CoverSkeleton = () => {
  return <Skeleton className="h-48 w-full bg-gray-300" />;
};

export const CoverSkeletonMid = () => {
  return <Skeleton className="h-24 w-full bg-gray-300" />;
};
