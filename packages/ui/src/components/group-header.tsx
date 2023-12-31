import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Avatar,
} from '@/components/ui';
import { httpGet, httpPost } from '@/lib/request';
import { setFetchingGroups, setGroups } from '@/store/groups';
import { LogOut, Plus } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import AddMember from './add-member';
import { useNavigate } from 'react-router';

interface GroupHeaderProps {
  group: any;
  onSuccess: () => void;
}

function GroupHeader({ group, onSuccess }: GroupHeaderProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const getGroups = async () => {
    dispatch(setFetchingGroups(true));
    const response = await httpGet('/group/list');
    dispatch(setFetchingGroups(false));
    if (response) dispatch(setGroups(response.data || []));
  };

  const leftChat = async () => {
    setBtnLoading(true);
    const response = await httpPost(`/group/left`, { groupId: group._id });
    setBtnLoading(false);
    if (response.success) {
      getGroups();
      navigate('/groups');
    }
  };

  return (
    <div className="flex items-center border-b px-5 py-3">
      <div className="w-14 h-14">
        <Avatar src={group?.avatar} alt="group icon" className="w-full h-full rounded-full object-cover" iconSize={24} />
      </div>
      <div className="ml-3 flex-1">
        <h1 className="font-semibold text-lg">{group.name}</h1>
        <p className="text-xs text-gray-500">{group?.groupMembers?.length} Members</p>
      </div>
      <div className="flex items-centerg gap-3">
        <div
          className="w-9 h-9 rounded-xl text-gray-500 bg-white shadow-sm hover:shadow-lg flex items-center justify-center cursor-pointer transition duration-200 ease-in-out"
          onClick={() => setShowMemberModal(true)}
        >
          <Plus size={16} className="text-black" />
        </div>
        <div
          className="w-9 h-9 rounded-xl text-gray-500 bg-white shadow-sm hover:shadow-lg flex items-center justify-center cursor-pointer transition duration-200 ease-in-out"
          onClick={() => setShowLeaveConfirm(true)}
        >
          <LogOut size={16} className="text-primary" />
        </div>
      </div>

      {/* Add member popup */}
      {showMemberModal && (
        <AddMember
          visible={showMemberModal}
          onClose={() => setShowMemberModal(false)}
          onSuccess={() => {
            setShowMemberModal(false);
            onSuccess();
          }}
          group={group}
        />
      )}

      {/* Group leave Confirm action */}
      <AlertDialog open={showLeaveConfirm} onOpenChange={() => setShowLeaveConfirm(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to exit from this group</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={leftChat} disabled={btnLoading}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default GroupHeader;
