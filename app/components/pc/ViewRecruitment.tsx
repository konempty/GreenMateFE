import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Loader2, MapPin, Users } from "lucide-react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import {
  createTeamRecruitmentComment,
  getTeamRecruitDetail,
  joinTeamRecruitment,
} from "@/app/api/teamAPI";
import { useAlert } from "@/app/contexts/AlertContext";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

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
    createTeamRecruitmentComment(teamRecruitId, commentContent).then(() => {
      data.comments.push({
        user: {
          id: user.userId,
          nickname: user.nickname,
          profileImageUrl: user.profileImageUrl,
        },
        content: commentContent,
        id: 0,
        createdAt: format(new Date(), "yyyy-MM-dd HH:mm"),
      });
      setData({ ...data });
      setCommentContent("");
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
            <span>활동 위치</span>
          </div>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "300px" }}
              //center={data.location}
              zoom={15}
            >
              {
                //<Marker position={data.location} />
              }
            </GoogleMap>
          ) : (
            <div>Loading map...</div>
          )}
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
            {isJoining ? (
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
