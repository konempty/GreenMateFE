import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface CommunityPost {
  id: number;
  author: string;
  avatar: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
}

interface CommunityProps {
  onCreateClick: () => void;
  onViewClick?: (postId: number) => void;
}

export default function MobileCommunity({
  onCreateClick,
  onViewClick = () => {},
}: CommunityProps) {
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: 1,
      author: "에코맘",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "오늘 아이들과 함께 공원 청소를 했어요. 작은 실천이 큰 변화를 만듭니다!",
      images: [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
      ],
      likes: 15,
      comments: 3,
    },
    {
      id: 2,
      author: "그린워커",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "플라스틱 없는 한 달 살기 도전 중! 여러분도 동참해보세요.",
      images: [],
      likes: 28,
      comments: 7,
    },
    {
      id: 3,
      author: "지구사랑",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "재활용 센터 방문 후기: 우리의 쓰레기가 어떻게 처리되는지 알게 되었어요.",
      images: ["/placeholder.svg?height=400&width=600"],
      likes: 42,
      comments: 12,
    },
  ]);

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
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
                <AvatarImage src={post.avatar} alt={post.author} />
                <AvatarFallback>{post.author[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold">{post.author}</p>
                <p className="text-sm text-muted-foreground">3시간 전</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{post.content}</p>
              {post.images.length > 0 && (
                <div className="relative w-full" style={{ maxHeight: "300px" }}>
                  <Slider {...sliderSettings} className="max-h-[300px]">
                    {post.images.map((image, index) => (
                      <div key={index} className="outline-none h-[300px]">
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
                  <Heart className="mr-2 h-4 w-4" /> {post.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="mr-2 h-4 w-4" /> {post.comments}
                </Button>
              </div>
              <Button variant="ghost" size="sm">
                <Share2 className="mr-2 h-4 w-4" /> 공유
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
