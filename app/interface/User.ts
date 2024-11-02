interface User {
  email: string;
  userId: string;
  nickname: string;
  profileImageUrl: string;
}

interface SignUpRequest {
  nickname: string;
  email: string;
  password: string;
}

interface AccessTokenResponse {
  accessToken: string;
  refreshToken: string;
  errorMessage?: string;
}
