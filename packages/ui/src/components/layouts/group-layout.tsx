import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui';
import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import GroupSidebar from '../group-sidebar';
import { useDispatch } from 'react-redux';
import { setAuth } from '@/store/app';

function GroupLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const onLogout = () => {
    localStorage.clear();
    dispatch(setAuth(false));
    navigate('/');
  };

  return (
    <div className="h-full flex">
      <div className="w-14 border-r h-full flex flex-col justify-between py-4 px-2">
        <div className="w-[40px] h-[40px] border rounded-xl flex items-center justify-center bg-primary text-white text-xl">F</div>
        <div
          className="w-[40px] h-[40px] border rounded-xl flex items-center justify-center bg-white border-gray-200 text-gray-500 text-xl cursor-pointer hover:shadow-md"
          onClick={() => setShowLogoutConfirm(true)}
        >
          <LogOut size={15} />
        </div>
      </div>
      <GroupSidebar />
      <div className="flex w-[79%] relative max-w-full">{children}</div>

      {/* Group leave Confirm action */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={() => setShowLogoutConfirm(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to logout from this app</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default GroupLayout;
