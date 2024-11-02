import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, Users } from "lucide-react";

export default function TeamRecruitment({
  onCreateClick = () => {},
  onViewClick = () => {},
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const recruitments = [
    {
      id: 1,
      title: "해변 청소 봉사자 모집",
      description: "주말 해변 청소 활동에 참여할 팀원을 모집합니다.",
      date: "2024-05-15",
      members: 5,
      status: "모집중",
    },
    {
      id: 2,
      title: "재활용 캠페인 기획팀",
      description: "지역 재활용 캠페인을 기획할 팀원을 찾습니다.",
      date: "2024-06-01",
      members: 3,
      status: "모집중",
    },
    {
      id: 3,
      title: "친환경 제품 리뷰단",
      description: "친환경 제품을 사용하고 리뷰를 작성할 팀원을 모집합니다.",
      date: "2024-05-20",
      members: 10,
      status: "마감임박",
    },
  ];

  const filteredRecruitments = recruitments.filter(
    (recruitment) =>
      recruitment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recruitment.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700">팀 모집</h2>
        <Button
          className="bg-green-600 hover:bg-green-700"
          onClick={onCreateClick}
        >
          모집글 작성
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10 pr-4 py-2 w-full"
          placeholder="팀 또는 활동 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecruitments.map((recruitment) => (
          <Card
            key={recruitment.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <CardHeader className="bg-green-50">
              <CardTitle className="text-lg font-semibold text-green-800">
                {recruitment.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-600 mb-4">
                {recruitment.description}
              </p>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                {recruitment.date}
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Users className="w-4 h-4 mr-2" />
                {recruitment.members}명 모집
              </div>
              <div className="flex justify-between items-center">
                <Badge
                  variant={
                    recruitment.status === "모집중" ? "default" : "secondary"
                  }
                >
                  {recruitment.status}
                </Badge>
                <Button variant="outline" size="sm">
                  상세보기
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
