import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Leaf, Loader2, Upload } from "lucide-react";
import { checkNicknameDuplicate, signUp } from "@/app/util/userAPI";
import { useAlert } from "@/app/contexts/AlertContext";

interface SignUpProps {
  onSignUp: (response: AccessTokenResponse) => void;
  onSwitchToLogin: () => void;
}

export default function SignUp({ onSignUp, onSwitchToLogin }: SignUpProps) {
  const { showAlert } = useAlert();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCheckingNickName, setIsCheckingNickName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showAlert("비밀번호가 일치하지 않습니다.", "error");
      return;
    }
    if (!isNicknameChecked) {
      showAlert("닉네임 중복 확인을 해주세요.", "info");
      return;
    }

    setIsLoading(true);
    try {
      const response = await signUp(
        { nickname, email, password },
        profileImage,
      );
      if (response.status === 201) onSignUp(response.data);
      else
        showAlert(
          response.data.errorMessage || "에러가 발생했습니다.",
          "error",
        );
    } catch (error: any) {
      showAlert(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const checkNickname = async () => {
    setIsCheckingNickName(true);
    try {
      const response = await checkNicknameDuplicate(nickname);
      if (response.data.isDuplicate) {
        showAlert("이미 사용중인 닉네임입니다.", "info");
      } else {
        setIsNicknameChecked(true);
      }
    } catch (error: any) {
      showAlert(error.message, "error");
    } finally {
      setIsCheckingNickName(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="h-12 w-12 text-green-600 mr-2" />
            <CardTitle className="text-3xl font-bold">GreenMate</CardTitle>
          </div>
          <CardDescription>
            환경 운동가들을 위한 커뮤니티에 가입하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <div className="flex space-x-2">
                  <Input
                    id="nickname"
                    placeholder="홍길동"
                    value={nickname}
                    onChange={(e) => {
                      setNickname(e.target.value);
                      setIsNicknameChecked(false);
                    }}
                    required
                  />
                  <Button
                    type="button"
                    onClick={checkNickname}
                    disabled={!nickname || isCheckingNickName}
                  >
                    {isCheckingNickName ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        확인중...
                      </>
                    ) : (
                      "중복 확인"
                    )}
                  </Button>
                </div>
                {isNicknameChecked && (
                  <p className="text-green-500 text-sm">
                    사용 가능한 닉네임입니다.
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profileImage">프로필 이미지</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() =>
                      document.getElementById("profileImage")?.click()
                    }
                    className="flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    이미지 업로드
                  </Button>
                  {profileImage && (
                    <span className="text-sm text-gray-500">
                      {profileImage.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  가입 중...
                </>
              ) : (
                "회원가입"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-gray-600">
            이미 계정이 있으신가요?{" "}
            <Button variant="link" className="p-0" onClick={onSwitchToLogin}>
              로그인
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
