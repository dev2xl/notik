import { useState } from "react";
import AiChatBox from "@/components/chatbox/AiChatBox";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

const AiChatButton = () => {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setChatBoxOpen(true)}>
        <Bot size={20} className="mr-2" />
        AI Chat
      </Button>
      <AiChatBox open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
    </>
  );
};

export default AiChatButton;
