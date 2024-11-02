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
  area: Area | null;
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
  area: Area | null;
}

interface Area {
  type: "CIRCLE" | "POLYGON" | null;
  center: Point | null;
  radius: number | null;
  points: Point[] | null;
}

interface Point {
  latitude: number;
  longitude: number;
}

/*
*
    val type: AreaType?,
    val center: Point?,
    val radius: Double?,
    val points: List<Point>?,
* */
