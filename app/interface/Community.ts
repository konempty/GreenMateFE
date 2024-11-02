interface CommunityPost {
  id: number;
  createdAt: string;
  title: string;
  description: string;
  imageUrls: string[];
  likeCount: number;
  commentCount: number;
  user: UserSimple;
  isLiked: boolean;
}

interface CreateCommunityRequest {
  title: string;
  description: string;
}

interface CommunityProps {
  onCreateClick: () => void;
  onViewClick?: (postId: number) => void;
}

interface CommunityData {
  id: number;
  title: string;
  createdAt: string;
  user: UserSimple;
  description: string;
  likeCount: number;
  commentCount: number;
  imageUrls: string[];
  comments: CommentDto[];
  isLiked: boolean;
}
