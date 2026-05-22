import { useAuth } from "@/contexts/auth.context";

export default function UserProfile({
  image,
  lyrics,
}: {
  image?: string;
  lyrics: string;
}) {
  return (
    <>
      {!image && (
        <div className="w-12 h-12 bg-gray-300 flex items-center justify-center rounded-full">
          <span className="font-bold text-gray-600">
            {lyrics.toUpperCase()}
          </span>
        </div>
      )}
    </>
  );
}
