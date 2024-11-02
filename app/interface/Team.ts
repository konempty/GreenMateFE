interface TeamRecruitmentSimple {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  joinCount: number;
  status: string;
}

interface CreateRecruitmentRequest {
  title: string;
  description: string;
  dueDate: string;
}

interface TeamRecruitmentProps {
  onCreateClick?: () => void;
  onViewClick: (id: number) => void;
}

interface RecruitmentData {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  imageUrls: string[];
  user: UserSimple;
  comments: CommentDto[];
  joinCount: number;
  isJoined: boolean;
}
