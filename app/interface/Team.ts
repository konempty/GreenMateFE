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

interface CommentDto {
  id: number;
  content: string;
  createdAt: string;
  user: UserSimple;
}
/*
    val id: Long,
    val title: String,
    val description: String,
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    val dueDate: LocalDateTime,
    val area: AreaDto?,
    val imageUrls: List<String>,
    val comments: List<CommentDto>,*/
