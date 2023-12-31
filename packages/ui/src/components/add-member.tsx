import { Avatar, Button, Checkbox, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui';
import { UserI } from '@/lib/models/user.model';
import { httpGet, httpPost } from '@/lib/request';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AddMemberProps {
  visible: boolean;
  group: any;
  onSuccess: () => void;
  onClose: () => void;
}

function AddMember({ visible, group, onSuccess, onClose }: AddMemberProps) {
  const [users, setUsers] = useState<UserI[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!selectedMembers.length) {
      toast.error('Please select atleast one member');
      return;
    }

    setLoading(true);
    const response = await httpPost('/group/add-member', {
      groupId: group._id,
      userIds: selectedMembers,
    });
    setLoading(false);
    if (response.success) {
      toast.success('Member added successfully');
      onSuccess && onSuccess();
    }
  };

  const onChangeCheckbox = (e: boolean, member: any) => {
    if (e) setSelectedMembers([...selectedMembers, member._id]);
    else setSelectedMembers(selectedMembers.filter((id) => id !== member._id));
  };

  const getUser = async () => {
    const response = await httpGet(`/user/unassigned?group_id=${group._id}`);
    if (response) setUsers(response.data || []);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle>Add new member</DialogTitle>
          <DialogDescription className="pt-5 text-black">
            <div className="flex items-center">
              <Avatar src={group?.avatar} alt="profie-img" className="rounded-full w-[50px] h-[50px] object-cover" />
              <div className="ml-2">
                <h1 className="font-medium text-base">{group?.name}</h1>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Add members to yoga group so they can start chatting with you.</p>

            <div className="max-h-[400px] overflow-auto mt-3">
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
            <Button onClick={onSubmit} disabled={loading}>
              Add Member
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
export default AddMember;
