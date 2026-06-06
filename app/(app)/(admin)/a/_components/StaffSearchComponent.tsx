import { SearchBarWrapper } from "@/components/SearchbarWrapper";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allRoles, departments, staffStatuses } from "@/constant";
import { formatWord } from "@/lib/utils";

export const StaffSearchComponent = () => {
  return (
    <Card>
      <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 w-full md:flex-2">
          <SearchBarWrapper />
        </div>
        <div className="w-full flex-3 grid grid-cols-2 md:grid-cols-3 gap-4">
          <Select>
            <SelectTrigger className="hidden md:flex [&>span_svg]:text-muted-foreground/80 bg-muted [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0">
              <SelectValue placeholder="Select roles" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
              {allRoles.map((role, index) => (
                <SelectItem key={index} value={role}>
                  <span className="truncate">{formatWord[role]}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="[&>span_svg]:text-muted-foreground/80 bg-muted [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
              {departments.map((department, index) => (
                <SelectItem key={index} value={department}>
                  <span className="truncate">{formatWord[department]}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="[&>span_svg]:text-muted-foreground/80 bg-muted [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
              {staffStatuses.map((status, index) => (
                <SelectItem key={index} value={status}>
                  <span className="truncate">{formatWord[status]}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
