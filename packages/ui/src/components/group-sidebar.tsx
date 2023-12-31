import EmptyIcon from '@/assets/empty.svg';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CreateGroup from './create-group';
import GroupCard from './group-card';
import ProfileInfo from './profile-info';
import { Input } from './ui';
import ListLoader from './ui/list-loader';
import { GroupsI } from '@/lib/models/groups.model';

function GroupSidebar() {
  const { groups, fetchingGroups } = useSelector((state: any) => state.groups);

  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupsList, setGroupsList] = useState<GroupsI[]>(groups);

  const onSearch = (e: any) => {
    const query = e.target.value;
    if (query) {
      const data = groups.filter((group: any) => group.name.toLowerCase().includes(e.target.value.toLowerCase()));
      setGroupsList(data);
    } else setGroupsList(groups);
  };

  useEffect(() => {
    setGroupsList(groups);
  }, [groups]);
  return (
    <div className="w-[320px] h-full p-3 overflow-auto">
      {/* Profile info */}
      <ProfileInfo />

      {/* Search input */}
      {!fetchingGroups && groups.length > 0 && <Input placeholder="Search groups..." onChange={onSearch} />}

      {/* Groups header */}
      <div className="flex items-center justify-between my-5">
        <h2 className="font-medium text-gray-600">Groups</h2>
        <div
          className="w-[30px] h-[30px] bg-gray-200 rounded-xl flex items-center justify-center cursor-pointer"
          onClick={() => setShowCreateGroupModal(true)}
        >
          <Plus size={16} />
        </div>
      </div>

      {/* loader */}
      {fetchingGroups && <ListLoader />}

      {/* List of groups */}
      {groupsList.length === 0 && !fetchingGroups && (
        <div className="flex items-center justify-center flex-col flex-1 min-h-[400px]">
          <img src={EmptyIcon} alt="" className="w-24 h-24 mb-2" />
          <h1 className="text-sm text-gray-500 text-center">
            You haven't joined any groups yet.
            <br /> Click the plus icon to create a group.
          </h1>
        </div>
      )}

      {groupsList.map((group: any, i: number) => (
        <GroupCard key={i} group={group} />
      ))}

      {showCreateGroupModal && (
        <CreateGroup visible={showCreateGroupModal} onClose={() => setShowCreateGroupModal(false)} onSuccess={() => setShowCreateGroupModal(false)} />
      )}
    </div>
  );
}

export default GroupSidebar;
