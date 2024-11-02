import { useState } from "react";
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
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface CommunityPostData {
  id: number;
  title: string;
  content: string;
  date: string;
  images: string[];
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  comments: {
    id: number;
    author: string;
    content: string;
    date: string;
  }[];
}

export default function ViewCommunityPost({
  data,
}: {
  data: CommunityPostData;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [commentContent, setCommentContent] = useState("");

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically send a request to your backend to update like status
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send a request to your backend to add the comment
    console.log("New comment:", commentContent);
    setCommentContent("");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl mb-2">{data.title}</CardTitle>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{data.date}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={data.author.avatar} alt={data.author.name} />
              <AvatarFallback>{data.author.name[0]}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{data.author.name}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-700">{data.content}</p>
          <div className="flex flex-wrap gap-2">
            {data.images.map((image, index) => (
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
              className={`mr-2 h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
            />
            {data.likes + (isLiked ? 1 : 0)}
          </Button>
          <Button variant="ghost" size="sm">
            <MessageCircle className="mr-2 h-4 w-4" /> {data.comments.length}
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          <Share2 className="mr-2 h-4 w-4" /> 공유하기
        </Button>
      </CardFooter>
      <CardContent>
        <h3 className="font-semibold mb-2">댓글</h3>
        <div className="space-y-4">
          {data.comments.map((comment) => (
            <div key={comment.id} className="flex space-x-2">
              <Avatar>
                <AvatarFallback>{comment.author[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{comment.author}</span>
                  <span className="text-sm text-gray-500">{comment.date}</span>
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
          <Button type="submit">댓글 작성</Button>
        </form>
      </CardContent>
    </Card>
  );
}
