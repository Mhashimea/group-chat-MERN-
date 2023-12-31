import ActionControl from '@/components/action-control';
import GroupDetails from '@/components/group-details';
import GroupHeader from '@/components/group-header';
import GroupMessages from '@/components/group-messages';
import GroupLayout from '@/components/layouts/group-layout';
import useSocket from '@/lib/hooks/useSocket';
import { GroupsI } from '@/lib/models/groups.model';
import { MessageI } from '@/lib/models/message.model';
import { httpGet } from '@/lib/request';
import { messageActions } from '@/lib/utils';
import { updateGroup } from '@/store/groups';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

function GroupView() {
  const socket: any = useSocket('http://localhost:3000');

  const dispatch = useDispatch();
  const { id } = useParams();
  const { groups } = useSelector((state: any) => state.groups);

  const [group, setGroup] = useState({} as GroupsI);
  const [messages, setMessages] = useState([] as MessageI[]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({} as any);
  const [loading, setLoading] = useState(false);

  const getGroupDetails = async () => {
    const response = await httpGet(`/group/details?group_id=${id}`);
    if (response.success) setGroup(response.data);
  };

  const getGroupMessages = async () => {
    const response = await httpGet(`/message/list?group_id=${id}&page=${page}`);
    if (response.succes) {
      if (page === 1) setMessages(response.data?.messages);
      else setMessages([...messages, ...response.data?.messages]);
      setMeta(response.data?.meta);
    }
  };

  const bindBroadcastMsg = (data: any) => {
    // append new message to messages last array and push to state
    const messagesClone = [...messages];
    messagesClone[messagesClone.length - 1].messages.push(data);
    setMessages(messagesClone);

    // save last message to group
    saveLastMessage(data);
  };

  const saveLastMessage = (data: any) => {
    const groupId = data.group_id;
    const group = groups.find((group: any) => group._id === groupId);
    if (group) {
      const payload = {
        ...group,
        lastMessage: data,
      };
      dispatch(updateGroup(payload));
    }
  };

  const fetchPage = async () => {
    setLoading(true);
    await getGroupDetails();
    await getGroupMessages();
    setLoading(false);
  };

  useEffect(() => {
    if (id) fetchPage();
  }, [id]);

  useEffect(() => {
    if (socket && !loading) {
      // join to group
      socket.emit('joinGroup', id);

      // listen to group message
      socket.on('groupMessage-' + id, (data: any) => {
        bindBroadcastMsg(data);
      });

      // listen to group action
      socket.on('groupAction-' + id, (data: any) => {
        // update group
        if (data.type === messageActions.member_added || data.type === messageActions.memeber_removed) {
          getGroupDetails();
        }
      });
    }
  }, [socket, loading]);

  useEffect(() => {
    if (socket)
      return () => {
        // leave group
        socket.emit('leaveGroup', id);
      };
  }, [id]);
  return (
    <GroupLayout>
      <div className="w-9/12 bg-gray-100 overflow-hidden">
        <GroupHeader group={group} onSuccess={getGroupDetails} />
        <GroupMessages messages={messages} />
        <ActionControl groupId={id as string} />
      </div>
      <div className="w-3/12 h-full p-3 overflow-auto">
        <GroupDetails group={group} />
      </div>
    </GroupLayout>
  );
}

export default GroupView;
