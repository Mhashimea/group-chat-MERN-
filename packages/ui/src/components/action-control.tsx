import { httpPost } from '@/lib/request';
import { messageTypes } from '@/lib/utils';
import { Send } from 'lucide-react';
import { useState } from 'react';

interface ActionControlProps {
  groupId: string;
}

function ActionControl({ groupId }: ActionControlProps) {
  const [message, setMessage] = useState('');

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!message) return;

    const payload = {
      group_id: groupId,
      message,
      message_type: messageTypes.user,
    };
    const response = await httpPost('/message/create', payload);
    if (response.message) setMessage('');
  };

  return (
    <div className="absolute bg-white w-[95%] left-5 bottom-3 rounded-md p-4 shadow-xl">
      <input
        type="text"
        className="outline-none w-full font-medium placeholder:text-sm"
        placeholder="Write your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <div
        className="absolute right-[7px] cursor-pointer bottom-[7px] w-[40px] h-[40px] flex items-center justify-center bg-primary rounded-xl"
        onClick={sendMessage}
      >
        <Send size={18} className="text-white" />
      </div>
    </div>
  );
}

export default ActionControl;
