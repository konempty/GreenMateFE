import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Loader2, MessageCircle } from "lucide-react";
import { useAlert } from "@/app/contexts/AlertContext";
import {
  createCommunityComment,
  getCommunityDetail,
  likeCommunity,
} from "@/app/api/communityAPI";
import { format } from "date-fns";

export default function ViewCommunityPost({ postId }: { postId: number }) {
  const { showAlert } = useAlert();
  let [data, setData] = useState<CommunityData>();
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  useEffect(() => {
    getCommunityDetail(postId).then((r) => setData(r.data));
  }, []);

  if (!data) return <div>로딩중...</div>;

  const handleLike = () => {
    likeCommunity(postId).then((r) => {
      if (r.data.isLike) {
        showAlert("좋아요를 눌렀습니다.", "success");
      } else {
        showAlert("좋아요를 취소했습니다.", "success");
      }
    });
  };
  const user: User = JSON.parse(
    atob(localStorage.getItem("accessToken")!!.split(".")[1]),
  );

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCommenting(true);
    createCommunityComment(postId, commentContent)
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl mb-2">{data.title}</CardTitle>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{data.createdAt}</span>
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
            <span className="font-semibold">{data.user.nickname}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-700">{data.description}</p>
          <div className="flex flex-wrap gap-2">
            {data.imageUrls.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full md:w-1/2 lg:w-1/3 rounded-lg"
              />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div className="flex space-x-4">
          <Button variant="ghost" size="sm" onClick={handleLike}>
            <Heart
              className={`mr-2 h-4 w-4 ${data.isLiked ? "fill-red-500 text-red-500" : ""}`}
            />
            {data.likeCount}
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="mr-2 h-4 w-4" /> {data.comments.length}
          </Button>
        </div>
      </CardFooter>
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
      </CardContent>
    </Card>
  );
}
