import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

interface RecruitmentData {
  id: number;
  title: string;
  content: string;
  date: string;
  time: string;
  location: { lat: number; lng: number };
  images: string[];
  author: {
    name: string;
    avatar: string;
    rating: number;
  };
  participants: number;
  maxParticipants: number;
}

export default function MobileViewRecruitment({
  data,
  onClose,
}: {
  data: RecruitmentData;
  onClose: () => void;
}) {
  const [isParticipating, setIsParticipating] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const handleParticipate = () => {
    setIsParticipating(!isParticipating);
    // Here you would typically send a request to your backend to update participation status
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={onClose} className="mr-2">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">팀 모집 상세</h1>
      </div>
      <Card>
        <CardContent className="p-4 space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-2">{data.title}</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{data.date}</span>
              <Clock className="w-4 h-4 ml-2" />
              <span>{data.time}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={data.author.avatar} alt={data.author.name} />
              <AvatarFallback>{data.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{data.author.name}</p>
              <p className="text-sm text-yellow-500">
                ★ {data.author.rating.toFixed(1)}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {data.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-48 object-cover rounded"
              />
            ))}
          </div>
          <p className="text-gray-700">{data.content}</p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>활동 위치</span>
            </div>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "200px" }}
                center={data.location}
                zoom={15}
              >
                <Marker position={data.location} />
              </GoogleMap>
            ) : (
              <div>Loading map...</div>
            )}
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">
                {data.participants}/{data.maxParticipants} 참가 중
              </span>
            </div>
          </div>
          <Button
            onClick={handleParticipate}
            className={`w-full ${isParticipating ? "bg-red-500 hover:bg-red-600" : ""}`}
          >
            {isParticipating ? "참가 취소" : "참가하기"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
