import { Skeleton } from '@/components/ui';

function ListLoader() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div className="p-2 border rounded-md mb-2 flex items-center border-gray-100" key={i}>
          <div className="w-1/5">
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
          <div className="ml-2 w-4/5">
            <Skeleton className="w-full h-2 rounded-full mb-2" />
            <Skeleton className="w-1/2 h-2 rounded-full" />
          </div>
        </div>
      ))}
    </>
  );
}

export default ListLoader;
