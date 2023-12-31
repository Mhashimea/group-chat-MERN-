import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { Avatar } from '../ui';

interface MessageProps {
  message: any;
}

function Message({ message }: MessageProps) {
  const { user } = useSelector((state: any) => state.app);
  return (
    <div className="mb-4">
      <p className={`text-xs font-medium mb-1 ${message.sender_id === user?._id ? 'text-right' : 'text-left'}`}>
        {message?.sender?.name} {dayjs(message.createdAt).format('hh:mm A')}
      </p>
      <div className={`flex items-center ${message.sender_id === user?._id ? 'justify-start flex-row-reverse' : 'justify-start'}`}>
        <Avatar src={message?.sender?.avatar} alt={message?.sender?.avatar} className="w-10 h-10 rounded-full mx-2" />

        <div className="bg-white p-3 rounded-xl max-w-[400px]">
          <p className="text-sm">{message.message}</p>
        </div>
      </div>
    </div>
  );
}

export default Message;
