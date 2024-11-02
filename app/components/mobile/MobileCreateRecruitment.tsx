import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Circle,
  Loader2,
  Pentagon,
  X,
} from "lucide-react";
import {
  DrawingManager,
  GoogleMap,
  Libraries,
  useJsApiLoader,
} from "@react-google-maps/api";
import { createTeamRecruitment } from "@/app/api/teamAPI";
import { useAlert } from "@/app/contexts/AlertContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// libraries 배열을 상수로 선언
const libraries: Libraries = ["drawing"];

export default function MobileCreateRecruitment({ onClose = () => {} }) {
  const { showAlert } = useAlert();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [location, setLocation] = useState({ lat: 37.5665, lng: 126.978 }); // Default to Seoul
  const [isLoading, setIsLoading] = useState(false);
  const [drawingMode, setDrawingMode] = useState<"circle" | "polygon" | null>(
    null,
  );
  const [selectedShape, setSelectedShape] = useState<
    google.maps.Circle | google.maps.Polygon | null
  >(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries,
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
    let area: Area | null = null;
    if (drawingMode != null) {
      if (!selectedShape) {
        showAlert("영역을 그려주세요.", "info");
        setIsLoading(false);
        return;
      }
      if (drawingMode === "circle") {
        const circle = selectedShape as google.maps.Circle;
        const center = circle.getCenter()!!;
        const radius = circle.getRadius();
        area = {
          type: "CIRCLE",
          center: { latitude: center.lat(), longitude: center.lng() },
          radius: radius,
          points: null,
        };
      } else if (drawingMode === "polygon") {
        const polygon = selectedShape as google.maps.Polygon;
        const paths = polygon.getPath().getArray();
        const points = paths.map((latLng) => ({
          latitude: latLng.lat(),
          longitude: latLng.lng(),
        }));
        points.push({
          latitude: points[0].latitude,
          longitude: points[0].longitude,
        });
        area = {
          type: "POLYGON",
          center: null,
          radius: null,
          points: points,
        };
      }
    }
    createTeamRecruitment(
      {
        title,
        description: content,
        dueDate: format(fullDate, "yyyy-MM-dd HH:mm:ss"),
        area,
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

  const clearSelectedShape = () => {
    if (selectedShape) {
      selectedShape.setMap(null);
      setSelectedShape(null);
    }
  };

  const onOverlayComplete = (e: google.maps.drawing.OverlayCompleteEvent) => {
    clearSelectedShape();

    if (e.type === "circle") {
      const circle = e.overlay as google.maps.Circle;
      setSelectedShape(circle);
      const center = circle.getCenter();
      const radius = circle.getRadius();
      console.log({ center: center?.toJSON(), radius });
    } else if (e.type === "polygon") {
      const polygon = e.overlay as google.maps.Polygon;
      setSelectedShape(polygon);
      const paths = polygon
        .getPath()
        .getArray()
        .map((latLng) => latLng.toJSON());
      console.log({ paths });
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={onClose} className="mr-2">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">팀 모집글 작성</h1>
      </div>
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
        <div>
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
        <div>
          <Label htmlFor="time">마감 시간</Label>
          <Input
            id="time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>위치</Label>
          <div className="mb-2 flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={drawingMode || ""}
              onValueChange={(value) =>
                setDrawingMode(value as "circle" | "polygon" | null)
              }
              className="justify-start"
            >
              <ToggleGroupItem value="circle" aria-label="원형 영역 그리기">
                <Circle className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="polygon" aria-label="다각형 영역 그리기">
                <Pentagon className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            {selectedShape && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearSelectedShape}
                className="ml-auto"
              >
                영역 지우기
              </Button>
            )}
          </div>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "200px" }}
              center={location}
              zoom={10}
            >
              <DrawingManager
                options={{
                  drawingControl: false,
                  circleOptions: {
                    fillColor: "#42a5f5",
                    fillOpacity: 0.3,
                    strokeWeight: 2,
                    strokeColor: "#1976d2",
                    clickable: true,
                    editable: true,
                  },
                  polygonOptions: {
                    fillColor: "#42a5f5",
                    fillOpacity: 0.3,
                    strokeWeight: 2,
                    strokeColor: "#1976d2",
                    clickable: true,
                    editable: true,
                  },
                }}
                drawingMode={
                  drawingMode === "circle"
                    ? google.maps.drawing.OverlayType.CIRCLE
                    : drawingMode === "polygon"
                      ? google.maps.drawing.OverlayType.POLYGON
                      : null
                }
                onOverlayComplete={onOverlayComplete}
              />
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
    </div>
  );
}
