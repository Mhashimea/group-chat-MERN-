import { Avatar, Button, Checkbox, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input } from '@/components/ui';
import { httpGet, httpPost } from '@/lib/request';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { addNewGroup } from '@/store/groups';
import { UserI } from '@/lib/models/user.model';

interface CreateGroupProps {
  visible: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

function CreateGroup({ visible, onSuccess, onClose }: CreateGroupProps) {
  const dispatch = useDispatch();

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [users, setUsers] = useState<UserI[]>([]);
  const [groupName, setGroupName] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  const onSubmit = async () => {
    if (!groupName) {
      toast.error('Please enter group name');
      return;
    }
    if (!selectedMembers.length) {
      toast.error('Please select members');
      return;
    }

    setBtnLoading(true);
    const response = await httpPost('/group/create', { name: groupName, userIds: selectedMembers });
    setBtnLoading(false);
    if (response) {
      toast.success('Group created successfully');
      dispatch(addNewGroup(response));
      onSuccess();
    }
  };

  const onChangeCheckbox = (e: boolean, member: any) => {
    if (e) setSelectedMembers([...selectedMembers, member._id]);
    else setSelectedMembers(selectedMembers.filter((id) => id !== member._id));
  };

  const getUser = async () => {
    const response = await httpGet('/user/list');
    if (response) setUsers(response.data || []);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle>Create new group</DialogTitle>
          <DialogDescription className="pt-5 text-black">
            <div className="mb-5">
              <label htmlFor="groupname" className="mb-2 block text-gray-500 text-sm">
                Group Name
              </label>
              <Input placeholder="Name of your group" id="groupname" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
            </div>
            <p className="text-sm text-gray-500 my-3">Choose members to add in this group.</p>

            <div className="max-h-[400px] overflow-auto">
              {users.map((user, i) => {
                return (
                  <div key={i} className="w-full flex items-center cursor-pointer mb-4 rounded-xl ransition duration-200 ease-in-out">
                    <Checkbox
                      id={user?._id}
                      className="mr-2"
                      value={user?._id}
                      checked={selectedMembers.includes(user?._id)}
                      onCheckedChange={(e: boolean) => onChangeCheckbox(e, user)}
                    />
                    <label className="flex items-center w-full cursor-pointer" htmlFor={user?._id}>
                      <Avatar src={user.avatar} alt="" className="rounded-full object-cover w-[50px] h-[50px]" />

                      <span className="text-base font-medium line-clamp-1 ml-2 cursor-pointer">{user.name}</span>
                    </label>
                  </div>
                );
              })}
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button variant={'link'} onClick={onClose}>
              Close
            </Button>
            <Button onClick={onSubmit} disabled={btnLoading}>
              Create Group
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
export default CreateGroup;
