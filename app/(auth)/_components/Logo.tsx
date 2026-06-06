import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
  name?: string;
  acronym?: string;
  logo?: string;
}

export const FullLogo = ({
  name = "EduManage",
  acronym = "EMS",
  logo,
}: Props) => {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2 justify-start")}
    >
      <Logo acronym={acronym} logo={logo} />
      <div className="space-y-0">
        <h2 className="font-medium text-lg text-primary group-hover:text-primary transition-all">
          {name}
        </h2>
        <p className="text-muted-foreground text-sm -mt-1 group-hover:text-black dark:group-hover:text-white transition-all">
          School Management
        </p>
      </div>
    </Link>
  );
};

export const Logo = ({ acronym = "EMS", logo }: Props) => {
  return (
    <Link
      href="/"
      className={cn(
        "text-white rounded-xl flex items-center justify-center",
        !logo && "bg-primary p-3"
      )}
    >
      {logo ? (
        <div className="rounded-md overflow-hidden shadow">
          <Image
            src={logo}
            alt={`${acronym}'s logo`}
            width={1000}
            height={1000}
            className="object-cover aspect-video size-[45px] md:size-[55px]"
          />
        </div>
      ) : (
        <span className="font-bold text-lg">{acronym}</span>
      )}
    </Link>
  );
};
