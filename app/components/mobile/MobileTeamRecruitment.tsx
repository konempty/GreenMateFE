import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Custom SVG icons
const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="검색"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="위치"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="날짜"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="모집 인원"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function MobileTeamRecruitment({
  onCreateClick = () => {},
  onViewClick = () => {},
}) {
  const [recruitments, setRecruitments] = useState([
    {
      id: 1,
      title: "해변 청소 봉사자 모집",
      description: "주말 해변 청소 활동에 참여할 팀원을 모집합니다.",
      location: "부산 해운대",
      date: "2024-05-15",
      members: 5,
    },
    {
      id: 2,
      title: "재활용 캠페인 기획팀",
      description: "지역 재활용 캠페인을 기획할 팀원을 찾습니다.",
      location: "서울 강남구",
      date: "2024-06-01",
      members: 3,
    },
    {
      id: 3,
      title: "친환경 제품 리뷰단",
      description: "친환경 제품을 사용하고 리뷰를 작성할 팀원을 모집합니다.",
      location: "온라인",
      date: "2024-05-20",
      members: 10,
    },
  ]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            className="pl-10 pr-4 py-2 w-full"
            placeholder="팀 또는 활동 검색..."
          />
        </div>
      </div>
      <div className="mb-4">
        <Button className="w-full" onClick={onCreateClick}>
          모집글 작성
        </Button>
      </div>
      <div className="space-y-4">
        {recruitments.map((recruitment) => (
          <Card
            key={recruitment.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <CardTitle className="text-lg">{recruitment.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">
                {recruitment.description}
              </p>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <MapPinIcon className="w-4 h-4 mr-1" />
                {recruitment.location}
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {recruitment.date}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <UsersIcon className="w-4 h-4 mr-1" />
                {recruitment.members}명 모집
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
