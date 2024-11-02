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
import { Leaf, Loader2 } from "lucide-react";
import { login } from "@/app/util/userAPI";
import { useAlert } from "@/app/contexts/AlertContext";

interface LoginProps {
  onLogin: (response: AccessTokenResponse) => void;
  onSwitchToSignUp: () => void;
}

export default function Login({ onLogin, onSwitchToSignUp }: LoginProps) {
  const { showAlert } = useAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    login(email, password)
      .then((response) => {
        if (response.status === 200) onLogin(response.data);
        else
          showAlert(
            response.data.errorMessage || "에러가 발생했습니다.",
            "error",
          );
      })
      .catch((error: any) => {
        showAlert(error.message, "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
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
            환경 운동가들을 위한 커뮤니티에 오신 것을 환영합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
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
            </div>
            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  로그인 중...
                </>
              ) : (
                "로그인"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-gray-600">
            계정이 없으신가요?{" "}
            <Button variant="link" className="p-0" onClick={onSwitchToSignUp}>
              회원가입
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
