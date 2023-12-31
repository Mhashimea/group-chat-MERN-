import { useSelector } from 'react-redux';
import { Avatar } from '@/components/ui';

function ProfileInfo() {
  const { user } = useSelector((state: any) => state.app);
  return (
    <div className="pt-8 pb-5 flex flex-col justify-center items-center">
      <div className="flex flex-col items-center">
        <Avatar src={user?.avatar} alt="profie-img" className="rounded-full w-[100px] h-[100px] object-cover m-auto" iconSize={40} />
        <h1 className="my-3 font-medium text-lg">{user?.name}</h1>
      </div>
    </div>
  );
}

export default ProfileInfo;
