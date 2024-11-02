import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import { getLearningList } from "@/app/api/learningAPI";

export default function MobileRecyclingLearning() {
  const [learningItems, setLearningItems] = useState<Learning[]>([]);
  useEffect(() => {
    getLearningList().then((r) => setLearningItems(r.data));
  }, []);
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-green-700 mb-4">분리수거 학습</h2>
      <div className="grid grid-cols-1 gap-4">
        {learningItems.map((item) => (
          <Dialog key={item.title}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="flex items-center p-4">
                  <img
                    src={item.iconImage}
                    alt={item.title}
                    className="w-40 h-40 mr-2"
                  />
                  <h3 className="text-lg font-semibold">{item.title}</h3>
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
    </div>
  );
}
