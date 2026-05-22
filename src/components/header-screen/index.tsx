import { CircleArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
  description: string;
  backButton?: boolean;
  actionsButtons?: { tailwindBgColor: string; action: () => void, title: string, icon: React.ReactNode }[];
};
export default function HeaderScreen({
  title,
  description,
  backButton = true,
  actionsButtons,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex md:items-center  md:mt-0 mt-5 justify-between flex-col md:mb-0 mb-5 items-start md:flex-row">
      <div className="flex items-center gap-4 mb-8 ">
        {backButton && (
          <button
            className="flex items-center cursor-pointer text-blue-500 p-2 rounded-full bg-amber-800 hover:text-blue-700 mb-4"
            onClick={() => router.back()}
          >
            <CircleArrowLeftIcon size={25} color="white" />
          </button>
        )}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          <p className="text-[14px] text-gray-600 mt-2">{description}</p>
        </div>
      </div>
      {actionsButtons && actionsButtons.length > 0 && (
        <div className="flex gap-2">
          {actionsButtons.map((button, index) => (
            <button
              key={index}
              className={`${button.tailwindBgColor} cursor-pointer hover:-mt-2 hover:opacity-80 font-medium flex items-center gap-2 text-white px-5 py-2 rounded-md`}
              onClick={button.action}
            >
              {button.icon}
              {button.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
