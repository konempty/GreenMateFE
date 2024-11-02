import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ImageIcon, X } from "lucide-react";
import { useAlert } from "@/app/contexts/AlertContext";
import { createCommunity } from "@/app/api/communityAPI";

export default function MobileCreateCommunityPost({ onClose = () => {} }) {
  const { showAlert } = useAlert();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files].slice(0, 5));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    createCommunity({ title, description: content }, images)
      .then(() => {
        showAlert("글 작성에 성공했습니다.", "success");
        onClose();
      })
      .catch((e) => {
        showAlert("글 작성에 실패했습니다.", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={onClose} className="mr-2">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">커뮤니티 글 작성</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="mobile-title">제목</Label>
          <Input
            id="mobile-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="mobile-content">내용</Label>
          <Textarea
            id="mobile-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={6}
          />
        </div>
        <div>
          <Label htmlFor="mobile-image-upload">이미지 첨부 (최대 5개)</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="mobile-image-upload"
              type="file"
              onChange={handleImageUpload}
              multiple
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              onClick={() =>
                document.getElementById("mobile-image-upload")!!.click()
              }
              variant="outline"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              이미지 선택
            </Button>
            <span className="text-sm text-gray-500">{images.length}/5</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Uploaded ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-0 right-0 rounded-full"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "작성 중..." : "작성완료"}
          </Button>
        </div>
      </form>
    </div>
  );
}
