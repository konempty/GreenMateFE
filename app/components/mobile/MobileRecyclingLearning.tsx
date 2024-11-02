import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Custom SVG icons
const BottleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="음료수병"
  >
    <path d="M8 2h8" />
    <path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2" />
  </svg>
);

const CanIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="음료수 캔"
  >
    <path d="M6 4h12" />
    <path d="M6 20h12" />
    <path d="M6 4v16a2  2 0 0 0 2 2h8a2 2 0 0 0 2-2V4" />
    <path d="M9 10h6" />
    <path d="M9 14h6" />
  </svg>
);

const PackageIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="과자 봉지"
  >
    <path d="M12 3L4 7v10l8 4 8-4V7l-8-4z" />
    <path d="M4 7l8 4" />
    <path d="M12 11l8-4" />
    <path d="M12 11v10" />
  </svg>
);

export default function MobileRecyclingLearning() {
  const recyclingItems = [
    {
      name: "음료수병",
      icon: BottleIcon,
      info: "깨끗이 씻어서 라벨을 제거한 후 분리수거함에 버립니다.",
      steps: [
        "내용물을 비웁니다.",
        "물로 헹굽니다.",
        "라벨을 제거합니다.",
        "분리수거함에 버립니다.",
      ],
    },
    {
      name: "음료수 캔",
      icon: CanIcon,
      info: "내용물을  비우고 물로 헹군 후 분리수거함에 버립니다.",
      steps: [
        "내용물을 비웁니다.",
        "물로 헹굽니다.",
        "찌그러뜨립니다.",
        "분리수거함에 버립니다.",
      ],
    },
    {
      name: "과자 봉지",
      icon: PackageIcon,
      info: "내용물을 비우고 가능한 깨끗이 한 후 비닐류 분리수거함에 버립니다.",
      steps: [
        "내용물을 비웁니다.",
        "가볍게 털어냅니다.",
        "비닐류 분리수거함에 버립니다.",
      ],
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-green-700 mb-4">분리수거 학습</h2>
      <div className="grid grid-cols-1 gap-4">
        {recyclingItems.map((item) => (
          <Dialog key={item.name}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="flex items-center p-4">
                  <item.icon className="w-8 h-8 text-green-600 mr-4" />
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center text-green-700">
                  <item.icon className="w-6 h-6 mr-2" />
                  {item.name} 재활용 방법
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <p className="text-gray-600 mb-4">{item.info}</p>
                <h4 className="font-semibold mb-2">재활용 단계:</h4>
                <ol className="list-decimal list-inside space-y-2">
                  {item.steps.map((step, index) => (
                    <li key={index} className="text-gray-700">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
