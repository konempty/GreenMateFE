import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getLearningList } from "@/app/api/learningAPI";

export default function RecyclingLearning() {
  const [learningItems, setLearningItems] = useState<Learning[]>([]);
  useEffect(() => {
    getLearningList().then((r) => setLearningItems(r.data));
  }, []);
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-green-700 mb-6">분리수거 학습</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningItems.map((item) => (
          <Dialog key={item.title}>
            <DialogTrigger asChild>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <img
                    src={item.iconImage}
                    alt={item.title}
                    className="w-40 h-40 mr-2"
                  />
                  <h3 className="text-lg font-semibold text-center">
                    {item.title}
                  </h3>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center text-green-700">
                  <img
                    src={item.iconImage}
                    alt={item.title}
                    className="w-20 h-20 mr-2"
                  />
                  {item.title} 재활용 방법
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
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
