import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, Search, Users } from "lucide-react";
import { getTeamRecruitList } from "@/app/api/teamAPI";

export default function MobileTeamRecruitment({
  onCreateClick,
  onViewClick,
}: TeamRecruitmentProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const [recruitments, setRecruitments] = useState<TeamRecruitmentSimple[]>([]);

  const filteredRecruitments = recruitments.filter(
    (recruitment) =>
      recruitment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruitment.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  useEffect(() => {
    getTeamRecruitList().then((r) => setRecruitments(r.data));
  }, []);

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="relative">
          {/* eslint-disable-next-line react/jsx-no-undef */}
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            className="pl-10 pr-4 py-2 w-full"
            placeholder="팀 또는 활동 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-4">
        <Button className="w-full" onClick={onCreateClick}>
          모집글 작성
        </Button>
      </div>
      <div className="space-y-4">
        {filteredRecruitments.map((recruitment) => (
          <Card
            key={recruitment.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onViewClick(recruitment.id)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{recruitment.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">
                {recruitment.description}
              </p>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <Calendar className="w-4 h-4 mr-1" />
                {recruitment.dueDate}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-1" />
                {recruitment.joinCount}명 모집
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
