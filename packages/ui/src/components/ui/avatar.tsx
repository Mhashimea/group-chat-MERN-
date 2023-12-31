import { User } from "lucide-react";

interface AvatarProps {
  className?: string;
  src?: string | null;
  alt?: string;
  iconSize?: number;
}

function Avatar({ className, src, alt, iconSize = 18 }: AvatarProps) {
  return (
    <>
      {src ? (
        <img src={src} className={className} alt={alt} />
      ) : (
        <div
          className={`${className} flex items-center justify-center bg-gray-200`}
        >
          <User size={iconSize} />
        </div>
      )}
    </>
  );
}

export default Avatar;
