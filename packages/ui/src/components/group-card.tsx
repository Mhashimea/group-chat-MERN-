import { useNavigate, useParams } from 'react-router';
import { Avatar } from './ui';
import dayjs from 'dayjs';

interface GroupCardProps {
  group: any;
}

function GroupCard({ group }: GroupCardProps) {
  const navigate = useNavigate();
  let { id } = useParams();

  return (
    <div
      className={`flex items-center cursor-pointer hover:bg-gray-100 rounded-xl p-3 transition duration-200 ease-in-out ${
        id === group._id && 'bg-gray-100'
      }`}
      onClick={() => navigate(`/groups/${group._id}`)}
    >
      <div className="mr-1">
        <Avatar src={group?.avatar} alt="" className="rounded-full object-cover w-[40px] h-[40px]" />
      </div>

      <div className="flex-1">
        <h4 className="font-medium line-clamp-1 leading-6">{group.name}</h4>
        {group?.lastMessage?._id ? (
          <p className="text-xs text-gray-500 line-clamp-1">{group.lastMessage?.message}</p>
        ) : (
          <p className="text-xs text-gray-500 line-clamp-1 italic">Tap to start</p>
        )}
      </div>
      <div className="text-center">
        <span className="text-xs text-gray-500">
          {dayjs(group?.lastMessage?.createdAt).format('ddd')}
          <br />
          {dayjs(group?.lastMessage?.createdAt).format('h:mm A')}
        </span>
      </div>
    </div>
  );
}

export default GroupCard;
