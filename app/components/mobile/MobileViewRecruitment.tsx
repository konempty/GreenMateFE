import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, Loader2, Users } from "lucide-react";
import {
  Circle as GoogleCircle,
  GoogleMap,
  Libraries,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useAlert } from "@/app/contexts/AlertContext";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  createTeamRecruitmentComment,
  getTeamRecruitDetail,
  joinTeamRecruitment,
} from "@/app/api/teamAPI";

const libraries: Libraries = ["drawing"];

const calculateZoomLevel = (area: Area) => {
  if (area.type === "CIRCLE") {
    const radius = area.radius!!;
    if (radius < 100) return 17;
    if (radius < 500) return 15;
    if (radius < 1000) return 14;
    if (radius < 5000) return 12;
    return 10;
  } else {
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

export default function MobileViewRecruitment({
  teamRecruitId,
  onClose,
}: {
  teamRecruitId: number;
  onClose: () => void;
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
  const user: User = JSON.parse(
    atob(localStorage.getItem("accessToken")!!.split(".")[1]),
  );

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
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 bg-white z-10 p-4 border-b">
        <div className="flex items-center">
          <Button variant="ghost" onClick={onClose} className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">{data?.title}</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage
              src={data?.user.profileImageUrl}
              alt={data?.user.nickname}
            />
            <AvatarFallback>{data?.user.nickname[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{data?.user.nickname}</p>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{data?.dueDate}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {data?.imageUrls.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Image ${index + 1}`}
              className="w-full h-48 object-cover rounded"
            />
          ))}
        </div>

        <p className="text-gray-700">{data?.description}</p>

        {isLoaded && data?.area ? (
          <div className="rounded-lg overflow-hidden">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "200px" }}
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
          </div>
        ) : null}

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">{data.joinCount} 참가 중</span>
          </div>
        </div>
        <Button
          onClick={handleParticipate}
          disabled={isJoining}
          className={`w-full ${data.isJoined ? "bg-red-500 hover:bg-red-600" : ""}`}
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

        <div>
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
                    <span className="font-semibold">
                      {comment.user.nickname}
                    </span>
                    <span className="text-sm text-gray-500">
                      {comment.createdAt}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleComment}>
          <Textarea
            placeholder="댓글을 입력하세요..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            className="mb-2"
          />
          <Button
            type="submit"
            className="w-full"
            disabled={isCommenting || !commentContent}
          >
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
      </div>
    </div>
  );
}
