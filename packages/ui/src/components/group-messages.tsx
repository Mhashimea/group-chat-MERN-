import { messageTypes } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import Message from './message-types/message';
import SystemMessage from './message-types/system-message';
import dayjs from 'dayjs';

interface GroupMessagesProps {
  messages: any[];
}

function GroupMessages({ messages }: GroupMessagesProps) {
  const ref = useRef<HTMLDivElement>(null);

  // scroll to bottom on load
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);
  return (
    <div className="overflow-auto p-4 h-[80%]" ref={ref}>
      {messages.map((messageItem, index: number) => {
        return (
          <div key={index}>
            {/* message date */}
            <div className="flex items-center justify-center my-4">
              <h1 className="text-center text-xs text-gray-600">{dayjs(messageItem._id).format('DD MMMM YYYY')}</h1>
            </div>

            {/* loop the messages */}
            {messageItem?.messages.map((message: any, msgIdx: number) => {
              if (message.message_type === messageTypes.system) {
                return <SystemMessage message={message} key={msgIdx} />;
              } else {
                return <Message message={message} key={msgIdx} />;
              }
            })}
          </div>
        );
      })}
    </div>
  );
}

export default GroupMessages;
