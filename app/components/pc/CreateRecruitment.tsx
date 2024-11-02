import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, X } from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { createTeamRecruitment } from "@/app/api/teamAPI";
import { useAlert } from "@/app/contexts/AlertContext";

interface CreateRecruitmentProps {
  onClose: () => void;
}

export default function CreateRecruitment({ onClose }: CreateRecruitmentProps) {
  const { showAlert } = useAlert();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({ lat: 37.5665, lng: 126.978 }); // Default to Seoul

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files].slice(0, 5));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      showAlert("마감 날짜를 선택해주세요.", "info");
      return;
    }
    setIsLoading(true);
    const fullDate = new Date(`${format(date, "yyyy-MM-dd")} ${time}`);
    createTeamRecruitment(
      {
        title,
        description: content,
        dueDate: format(fullDate, "yyyy-MM-dd HH:mm:ss"),
      },
      images,
    )
      .then((response) => {
        showAlert("팀 모집글이 작성되었습니다.", "success");
        if (response.status === 201) onClose();
        else
          showAlert(
            response.data.errorMessage || "에러가 발생했습니다.",
            "error",
          );
      })
      .catch((error) => {
        showAlert(error.message, "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>팀 모집글 작성</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>이미지 첨부 (최대 5개)</Label>
            <Input
              type="file"
              onChange={handleImageUpload}
              multiple
              accept="image/*"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Uploaded ${index + 1}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0 rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>마감 날짜</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>날짜 선택</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1">
              <Label htmlFor="time">마감 시간</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label>위치</Label>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "400px" }}
                center={location}
                zoom={10}
                onClick={(e) =>
                  setLocation({ lat: e.latLng!!.lat(), lng: e.latLng!!.lng() })
                }
              >
                <Marker position={location} />
              </GoogleMap>
            ) : (
              <div>Loading map...</div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  작성 중...
                </>
              ) : (
                "작성 완료"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
