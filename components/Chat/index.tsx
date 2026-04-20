"use client";
import { generateSlugId } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { toast } from "sonner";

type PropsType = {
  isProjectPage?: boolean;
  slugId?: string;
};
const ChartInterface = (props: PropsType) => {
  const { isProjectPage = false, slugId: propsSlugId } = props;
  const pathName = usePathname();
  const router = useRouter();
  const [slugId, setSlugId] = useState(() => propsSlugId || generateSlugId());
  const [input, setInput] = useState("");
  const [hasStarted, sethasStarted] = useState(isProjectPage);
  const { messages, sendMessage, setMessages, status, error, stop } = useChat({
    messages: [],
    transport: new DefaultChatTransport({
      api: "/api/project",
      prepareSendMessagesRequest: ({ messages, body }) => {
        return {
          body: {
            ...body,
            messages,
          },
        };
      },
    }),
    onError: (error) => {
      toast.error("Failed to generate response");
    },
  });

  return <div>ChartInterface</div>;
};

export default ChartInterface;
