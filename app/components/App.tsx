import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import TeamRecruitment from "./pc/TeamRecruitment";
import Community from "./pc/Community";
import RecyclingLearning from "./pc/RecyclingLearning";
import MobileTeamRecruitment from "@/app/components/mobile/MobileTeamRecruitment";
import MobileCommunity from "@/app/components/mobile/MobileCommunity";
import MobileRecyclingLearning from "@/app/components/mobile/MobileRecyclingLearning";
import CreateRecruitment from "./pc/CreateRecruitment";
import MobileCreateRecruitment from "@/app/components/mobile/MobileCreateRecruitment";
import ViewRecruitment from "./pc/ViewRecruitment";
import MobileViewRecruitment from "@/app/components/mobile/MobileViewRecruitment";
import CreateCommunityPost from "./pc/CreateCommunityPost";
import MobileCreateCommunityPost from "@/app/components/mobile/MobileCreateCommunityPost";
import ViewCommunityPost from "./pc/ViewCommunityPost";
import MobileViewCommunityPost from "@/app/components/mobile/MobileViewCommunityPost";
import Login from "./Login";
import SignUp from "./SignUp";
import UserProfile from "./UserProfile";
import {
  Leaf,
  MessageCircle,
  MessageSquare,
  Recycle,
  Send,
  Users,
  X,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("team-recruitment");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([
    {
      text: "무엇을 도와드릴까요?",
      sender: "bot",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isCreatingRecruitment, setIsCreatingRecruitment] = useState(false);
  const [isViewingRecruitment, setIsViewingRecruitment] = useState(false);
  const [isCreatingCommunityPost, setIsCreatingCommunityPost] = useState(false);
  const [isViewingCommunityPost, setIsViewingCommunityPost] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken"),
  );
  const [user, setUser] = useState<User>();
  const [teamRecruitId, setTeamRecruitId] = useState<number>(0);
  const [communityPostId, setCommunityPostId] = useState<number>(0);

  if (accessToken) {
    if (!user) {
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
      setUser(decodedToken);
    }
  } else if (user) {
    setUser(undefined);
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const sendMessage = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, sender: "user" }]);
      setInputMessage("");
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Thanks for your message! How can I help you today?",
            sender: "bot",
          },
        ]);
      }, 1000);
    }
  };

  const handleLogin = (token: AccessTokenResponse) => {
    localStorage.setItem("accessToken", token.accessToken);
    localStorage.setItem("refreshToken", token.refreshToken);
    setAccessToken(token.accessToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setUser(undefined);
  };

  const handleSignUp = (token: AccessTokenResponse) => {
    localStorage.setItem("accessToken", token.accessToken);
    localStorage.setItem("refreshToken", token.refreshToken);
    setAccessToken(token.accessToken);
    setIsSigningUp(false);
  };

  const switchToSignUp = () => {
    setIsSigningUp(true);
  };

  const switchToLogin = () => {
    setIsSigningUp(false);
  };

  if (!accessToken) {
    if (isSigningUp) {
      return <SignUp onSignUp={handleSignUp} onSwitchToLogin={switchToLogin} />;
    } else {
      return <Login onLogin={handleLogin} onSwitchToSignUp={switchToSignUp} />;
    }
  }

  function resetComponentStatus() {
    setIsCreatingRecruitment(false);
    setIsViewingRecruitment(false);
    setIsCreatingCommunityPost(false);
    setIsViewingCommunityPost(false);
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <Leaf className="h-6 w-6 text-green-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">GreenMate</h1>
            </div>
            {user ? <UserProfile user={user} onLogout={handleLogout} /> : null}
          </div>
        </header>

        <main className="pt-14 pb-16">
          {isCreatingRecruitment ? (
            <MobileCreateRecruitment
              onClose={() => setIsCreatingRecruitment(false)}
            />
          ) : isViewingRecruitment ? (
            <MobileViewRecruitment
              teamRecruitId={teamRecruitId}
              onClose={() => setIsViewingRecruitment(false)}
            />
          ) : isCreatingCommunityPost ? (
            <MobileCreateCommunityPost
              onClose={() => setIsCreatingCommunityPost(false)}
            />
          ) : isViewingCommunityPost ? (
            <MobileViewCommunityPost
              postId={communityPostId}
              onClose={() => setIsViewingCommunityPost(false)}
            />
          ) : (
            <>
              {activeTab === "team-recruitment" && (
                <MobileTeamRecruitment
                  onCreateClick={() => setIsCreatingRecruitment(true)}
                  onViewClick={(teamRecruitId) => {
                    setIsViewingRecruitment(true);
                    setTeamRecruitId(teamRecruitId);
                  }}
                />
              )}
              {activeTab === "community" && (
                <MobileCommunity
                  onCreateClick={() => setIsCreatingCommunityPost(true)}
                  onViewClick={(postId) => {
                    setIsViewingCommunityPost(true);
                    setCommunityPostId(postId);
                  }}
                />
              )}
              {activeTab === "recycling-learning" && (
                <MobileRecyclingLearning />
              )}
            </>
          )}
        </main>

        <footer className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0">
          <div className="flex justify-around items-center h-16">
            <Button
              variant="ghost"
              onClick={() => {
                setActiveTab("team-recruitment");
                resetComponentStatus();
              }}
              className="flex flex-col items-center"
            >
              <Users className="h-5 w-5" />
              <span className="text-xs">팀 모집</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setActiveTab("community");
                resetComponentStatus();
              }}
              className="flex flex-col items-center"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs">커뮤니티</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setActiveTab("recycling-learning");
                resetComponentStatus();
              }}
              className="flex flex-col items-center"
            >
              <Recycle className="h-5 w-5" />
              <span className="text-xs">분리수거 학습</span>
            </Button>
          </div>
        </footer>

        <Button
          className="fixed bottom-20 right-4 rounded-full w-12 h-12 shadow-lg"
          onClick={toggleChat}
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>

        {isChatOpen && (
          <Card className="fixed bottom-36 right-4 w-5/6 h-96 flex flex-col shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold">Green mAIt와 대화</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-lg p-2 max-w-[70%] ${message.sender === "user" ? "bg-green-500 text-white" : "bg-gray-200"}`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t flex">
              <Input
                type="text"
                placeholder="Type a message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 mr-2"
              />
              <Button type="submit" size="icon" aria-label="Send message">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Leaf className="h-8 w-8 text-green-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">GreenMate</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user ? <UserProfile user={user} onLogout={handleLogout} /> : null}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full justify-start bg-white rounded-lg shadow-sm mb-6">
            <TabsTrigger
              value="team-recruitment"
              className="flex-1 py-3"
              onClick={resetComponentStatus}
            >
              <Users className="w-5 h-5 mr-2" />팀 모집
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="flex-1 py-3"
              onClick={resetComponentStatus}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              커뮤니티
            </TabsTrigger>
            <TabsTrigger
              value="recycling-learning"
              className="flex-1 py-3"
              onClick={resetComponentStatus}
            >
              <Recycle className="w-5 h-5 mr-2" />
              분리수거 학습
            </TabsTrigger>
          </TabsList>
          <TabsContent value="team-recruitment">
            {isCreatingRecruitment ? (
              <CreateRecruitment
                onClose={() => setIsCreatingRecruitment(false)}
              />
            ) : isViewingRecruitment ? (
              <ViewRecruitment teamRecruitId={teamRecruitId} />
            ) : (
              <TeamRecruitment
                onCreateClick={() => setIsCreatingRecruitment(true)}
                onViewClick={(teamRecruitId) => {
                  setIsViewingRecruitment(true);
                  setTeamRecruitId(teamRecruitId);
                }}
              />
            )}
          </TabsContent>
          <TabsContent value="community">
            {isCreatingCommunityPost ? (
              <CreateCommunityPost
                onClose={() => setIsCreatingCommunityPost(false)}
              />
            ) : isViewingCommunityPost ? (
              <ViewCommunityPost postId={communityPostId} />
            ) : (
              <Community
                onCreateClick={() => setIsCreatingCommunityPost(true)}
                onViewClick={(postId) => {
                  setIsViewingCommunityPost(true);
                  setCommunityPostId(postId);
                }}
              />
            )}
          </TabsContent>
          <TabsContent value="recycling-learning">
            <RecyclingLearning />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500 text-sm">
          © 2024 GreenMate. All rights reserved.
        </div>
      </footer>

      <Button
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg"
        onClick={toggleChat}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {isChatOpen && (
        <Card className="fixed bottom-20 right-4 w-80 h-96 flex flex-col shadow-xl">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold">Green mAIt와 대화</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-lg p-2 max-w-[70%] ${message.sender === "user" ? "bg-green-500 text-white" : "bg-gray-200"}`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="p-4 border-t flex">
            <Input
              type="text"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 mr-2"
            />
            <Button type="submit" size="icon" aria-label="Send message">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
