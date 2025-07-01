import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Loader2, MapPin, Users } from "lucide-react";
import {
  Circle as GoogleCircle,
  GoogleMap,
  Libraries,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";
import {
  createTeamRecruitmentComment,
  getTeamRecruitDetail,
  joinTeamRecruitment,
} from "@/app/api/teamAPI";
import { useAlert } from "@/app/contexts/AlertContext";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

const libraries: Libraries = ["drawing"];

const calculateZoomLevel = (area: Area) => {
  if (area.type === "CIRCLE") {
    const radius = area.radius!!;
    // 반경에 따른 줌 레벨 계산
    if (radius < 100) return 17;
    if (radius < 500) return 15;
    if (radius < 1000) return 14;
    if (radius < 5000) return 12;
    return 10;
  } else {
    // 다각형의 경우 모든 점들의 범위를 계산
    const lats = area.points!!.map((p) => p.latitude);
    const lngs = area.points!!.map((p) => p.longitude);
    const latDiff = Math.max(...lats) - Math.min(...lats);
    const lngDiff = Math.max(...lngs) - Math.min(...lngs);
    const maxDiff = Math.max(latDiff, lngDiff);

    if (maxDiff < 0.01) return 15;
    if (maxDiff < 0.05) return 13;
    if (maxDiff < 0.1) return 11;
    return 10;
  }
};

export default function ViewRecruitment({
  teamRecruitId,
}: {
  teamRecruitId: number;
}) {
  const { showAlert } = useAlert();
  let [data, setData] = useState<RecruitmentData>();
  const [isJoining, setIsJoining] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  useEffect(() => {
    getTeamRecruitDetail(teamRecruitId).then((r) => setData(r.data));
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: libraries,
  });

  if (!data) return <div>로딩중...</div>;
  const handleParticipate = () => {
    setIsJoining(true);
    joinTeamRecruitment(teamRecruitId)
      .then((r) => {
        setData({
          ...data,
          joinCount: r.data.joinCount,
          isJoined: r.data.isJoin,
        });
        if (r.data.isJoin) {
          showAlert("참가신청이 완료되었습니다.");
        } else {
          showAlert("참가신청이 취소되었습니다.");
        }
      })
      .catch((e) => {
        showAlert("참가신청에 실패했습니다.", "error");
      })
      .finally(() => {
        setIsJoining(false);
      });
  };

  let base64 = localStorage
    .getItem("accessToken")!!
    .split(".")[1]
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  // 패딩 추가
  base64 += "=".repeat((4 - (base64.length % 4)) % 4);
  const user: User = JSON.parse(atob(base64));

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCommenting(true);
    createTeamRecruitmentComment(teamRecruitId, commentContent)
      .then(() => {
        data.comments.push({
          user: {
            id: user.userId,
            nickname: user.nickname,
            profileImageUrl: user.profileImageUrl,
          },
          content: commentContent,
          id: data.comments.length + 1,
          createdAt: format(new Date(), "yyyy-MM-dd HH:mm"),
        });
        setData({ ...data });
        setCommentContent("");
      })
      .catch(() => {
        showAlert("댓글 작성에 실패했습니다.", "error");
      })
      .finally(() => {
        setIsCommenting(false);
      });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl mb-2">{data.title}</CardTitle>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{data.dueDate}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage
                src={data.user.profileImageUrl}
                alt={data.user.nickname}
              />
              <AvatarFallback>{data.user.nickname[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{data.user.nickname}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {data.imageUrls.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Image ${index + 1}`}
                className="w-32 h-32 object-cover rounded"
              />
            ))}
          </div>
          <p className="text-gray-700">{data.description}</p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>활동영역</span>
          </div>
          {isLoaded && data.area != null ? (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "300px" }}
              center={
                data.area.type === "CIRCLE"
                  ? {
                      lat: data.area.center!!.latitude,
                      lng: data.area.center!!.longitude,
                    }
                  : {
                      lat: data.area.points!![0].latitude,
                      lng: data.area.points!![0].longitude,
                    }
              }
              zoom={data.area ? calculateZoomLevel(data.area) : 15}
              options={{
                disableDefaultUI: true,
                zoomControl: false,
                gestureHandling: "none",
                draggable: false,
                clickableIcons: false,
                styles: [
                  {
                    elementType: "geometry",
                    stylers: [{ color: "#f5f5f5" }],
                  },
                ],
              }}
            >
              {data.area.type === "CIRCLE" ? (
                <GoogleCircle
                  center={{
                    lat: data.area.center!!.latitude,
                    lng: data.area.center!!.longitude,
                  }}
                  radius={data.area.radius!!}
                  options={{
                    fillColor: "#42a5f5",
                    fillOpacity: 0.3,
                    strokeWeight: 2,
                    strokeColor: "#1976d2",
                    clickable: false,
                    editable: false,
                  }}
                />
              ) : (
                <Polygon
                  paths={data.area.points!!.map((point) => ({
                    lat: point.latitude,
                    lng: point.longitude,
                  }))}
                  options={{
                    fillColor: "#42a5f5",
                    fillOpacity: 0.3,
                    strokeWeight: 2,
                    strokeColor: "#1976d2",
                    clickable: false,
                    editable: false,
                  }}
                />
              )}
            </GoogleMap>
          ) : data.area != null ? (
            <div>Loading map...</div>
          ) : null}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">{data.joinCount} 참가 중</span>
            </div>
            <Button
              onClick={handleParticipate}
              disabled={isJoining}
              className={data.isJoined ? "bg-red-500 hover:bg-red-600" : ""}
            >
              {isJoining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  요청중...
                </>
              ) : data.isJoined ? (
                "참가 취소"
              ) : (
                "참가하기"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardContent>
        <h3 className="font-semibold mb-2">댓글</h3>
        <div className="space-y-4">
          {data.comments.map((comment) => (
            <div key={comment.id} className="flex space-x-2">
              <Avatar>
                <AvatarImage
                  src={comment.user.profileImageUrl}
                  alt={comment.user.nickname}
                />
                <AvatarFallback>{comment.user.nickname[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{comment.user.nickname}</span>
                  <span className="text-sm text-gray-500">
                    {comment.createdAt}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleComment} className="mt-4">
          <Textarea
            placeholder="댓글을 입력하세요..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className="mb-2"
          />
          <Button type="submit" disabled={isCommenting || !commentContent}>
            {isCommenting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                작성중...
              </>
            ) : (
              "댓글 작성"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
