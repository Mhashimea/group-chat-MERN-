import WelcomeBannerIcon from '@/assets/welcome.svg';

function WelcomeBanner() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
      <div className="w-[600px] mb-4">
        <img src={WelcomeBannerIcon} alt="" />
      </div>
      <h1 className="text-xl">
        Welcome to <span className="font-bold">Fliki Chat</span>
      </h1>
      <p className="text-sm text-gray-500">Select a group from the sidebar or create a new one to get started.</p>
    </div>
  );
}

export default WelcomeBanner;
