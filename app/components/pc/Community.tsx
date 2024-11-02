import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Heart, MessageCircle } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getCommunityList, likeCommunity } from "@/app/api/communityAPI";
import { useAlert } from "@/app/contexts/AlertContext";

export default function Community({
  onCreateClick,
  onViewClick = () => {},
}: CommunityProps) {
  const { showAlert } = useAlert();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  useEffect(() => {
    getCommunityList().then((r) => setPosts(r.data));
  }, []);

  const handleLike = (postId: number) => {
    likeCommunity(postId).then((r) => {
      if (r.data.isLike) {
        showAlert("좋아요를 눌렀습니다.", "success");
      } else {
        showAlert("좋아요를 취소했습니다.", "success");
      }
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? { ...post, likeCount: r.data.likeCount, isLiked: r.data.isLike }
            : post,
        ),
      );
    });
  };

  const CustomPrevArrow = ({ onClick = () => {} }) => {
    return (
      <button
        onClick={onClick}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    );
  };

  const CustomNextArrow = ({ onClick = () => {} }) => {
    return (
      <button
        onClick={onClick}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
        aria-label="Next image"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    );
  };

  const [dragging, setDragging] = useState<boolean>(false);
  const handleBeforeChange = useCallback(() => {
    setDragging(true);
  }, []);
  const handleAfterChange = useCallback((i: number) => {
    setDragging(false);
  }, []);
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    adaptiveHeight: false,
    swipe: true,
    swipeToSlide: true,
    touchThreshold: 100,
    beforeChange: handleBeforeChange,
    afterChange: handleAfterChange,
  };

  const onClickCard = useCallback(
    (id: number) => (e: React.SyntheticEvent) => {
      if (dragging) {
        e.stopPropagation();
        return;
      }
      onViewClick(id);
    },
    [dragging],
  );

  return (
    <div className="p-4">
      <Button onClick={onCreateClick} className="w-full mb-4">
        새 게시물 작성
      </Button>
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center space-x-4 pb-4">
              <Avatar>
                <AvatarImage
                  src={post.user.profileImageUrl}
                  alt={post.user.nickname}
                />
                <AvatarFallback>{post.user.nickname[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold">{post.user.nickname}</p>
                <p className="text-sm text-muted-foreground">
                  {post.createdAt}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{post.title}</p>
              {post.imageUrls.length > 0 && (
                <div className="relative w-full" style={{ maxHeight: "400px" }}>
                  <Slider {...sliderSettings} className="max-h-[400px]">
                    {post.imageUrls.map((image, index) => (
                      <div key={index} className="outline-none h-[400px]">
                        <img
                          src={image}
                          alt={`게시물 이미지 ${index + 1}`}
                          className="w-full h-full object-contain cursor-pointer"
                          onClick={onClickCard(post.id)}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-2">
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                >
                  <Heart
                    className={`mr-2 h-4 w-4 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`}
                  />
                  {post.likeCount}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="mr-2 h-4 w-4" /> {post.commentCount}
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
