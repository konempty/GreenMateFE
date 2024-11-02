import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

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
    <path d="M6 4v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4" />
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

export default function RecyclingLearning() {
  const [selectedItem, setSelectedItem] = useState(null);

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
      info: "내용물을 비우고 물로 헹군 후 분리수거함에 버립니다.",
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
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-green-700 mb-6">분리수거 학습</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recyclingItems.map((item) => (
          <Dialog key={item.name}>
            <DialogTrigger asChild>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <item.icon className="w-16 h-16 text-green-600 mb-4" />
                  <h3 className="text-lg font-semibold text-center">
                    {item.name}
                  </h3>
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
      <div className="mt-8 bg-green-50 p-4 rounded-lg">
        <div className="flex items-start">
          <Info className="w-6 h-6 text-green-600 mr-3 mt-1" />
          <p className="text-sm text-gray-700">
            올바른 분리수거는 환경 보호의 첫 걸음입니다. 각 품목별 재활용 방법을
            숙지하고 실천해 주세요. 더 자세한 정보는 환경부 홈페이지를
            참조하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
