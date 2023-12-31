import { Avatar } from './ui';

interface GroupDetailsProps {
  group: any;
}

function GroupDetails({ group }: GroupDetailsProps) {
  const { groupMembers = [] } = group;
  return (
    <div className="pt-8 pb-5">
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col items-center">
          <Avatar src={group?.avatar} alt="profie-img" className="rounded-full w-[100px] h-[100px] object-cover m-auto" iconSize={50} />
          <h1 className="mt-3 font-medium text-lg">{group.name}</h1>
          <p className="text-xs text-gray-500">{group?.groupMembers?.length} Members</p>
        </div>
      </div>

      <h2 className="font-medium text-gray-600 mt-5 mb-3 text-sm text-left">Group Members</h2>

      {/* Memebers */}
      {groupMembers.map((member: any, i: number) => {
        return (
          <div className="w-full flex items-center cursor-pointer hover:bg-gray-100 rounded-xl p-2 transition duration-200 ease-in-out" key={i}>
            <Avatar src={member.user?.avatar} alt={member.name} className="rounded-full object-cover w-[40px] h-[40px]" />

            <h4 className="text-sm font-medium line-clamp-1 ml-2">{member.user?.name}</h4>
          </div>
        );
      })}
    </div>
  );
}

export default GroupDetails;
