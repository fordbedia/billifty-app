"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, Button, Card, CardBody, CardHeader, Chip, Input } from "@heroui/react";
import { Bot, MessageCircleMore, Paperclip, SendHorizontal, X } from "lucide-react";

const initialMessages = [
  {
    id: "assistant-welcome",
    role: "assistant",
    text: "Hello! I'm your AI assistant. How can I help you today?",
  },
  {
    id: "user-1",
    role: "user",
    text: "Hi! Can you help me with my project?",
  },
  {
    id: "assistant-2",
    role: "assistant",
    text: "Of course! I'd be happy to help. What aspect of your project would you like assistance with?",
  },
];

const cannedReplies = [
  "I can help draft an invoice outline, pricing summary, or a cleaner client-facing message.",
  "Share a short brief and I can turn it into a more polished invoice-ready structure.",
  "If you want, I can help break the work into clearer line items and payment terms.",
];

function AssistantBadge() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#dceeff] bg-[#f4fbff] text-[#169eea]">
      <Bot size={16} strokeWidth={2.1} />
    </div>
  );
}

function MessageBubble({ role, text }) {
  const isUser = role === "user";

  return (
    <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser ? <AssistantBadge /> : null}
      <div
        className={`max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6 shadow-[0_16px_34px_-30px_rgba(17,24,39,0.5)] ${
          isUser
            ? "rounded-br-sm border border-[#cfeeff] bg-[#eef9ff] text-[#181f2c]"
            : "rounded-bl-sm border border-[#eef1f5] bg-white text-[#4f5968]"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [replyIndex, setReplyIndex] = useState(0);
  const [isResponding, setIsResponding] = useState(false);
  const messagesRef = useRef(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const viewport = messagesRef.current;
    if (!viewport) {
      return;
    }

    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: "smooth",
    });
  }, [isOpen, messages, isResponding]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const value = draft.trim();
    if (!value || isResponding) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        role: "user",
        text: value,
      },
    ]);
    setDraft("");
    setIsResponding(true);

    timerRef.current = window.setTimeout(() => {
      const reply = cannedReplies[replyIndex % cannedReplies.length];

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          text: reply,
        },
      ]);
      setReplyIndex((current) => current + 1);
      setIsResponding(false);
    }, 550);
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex max-w-[calc(100vw-1rem)] flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="pointer-events-auto w-[calc(100vw-1rem)] max-w-sm sm:w-[23rem]"
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            id="billifty-chat-widget"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <Card
              className="overflow-hidden rounded-lg border border-[#eef1f5] bg-white/95 shadow-[0_26px_70px_-44px_rgba(17,24,39,0.55)] backdrop-blur"
              radius="sm"
            >
              <CardHeader className="flex items-start justify-between gap-3 border-b border-[#eef1f5] bg-white px-5 py-4 text-[#181f2c]">
                <div className="flex items-center gap-3">
                  <Avatar
                    className="border border-[#dceeff] bg-[#f4fbff] text-[#169eea]"
                    fallback={<Bot size={18} strokeWidth={2.1} />}
                    name="AI Assistant"
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-semibold leading-none text-[#181f2c]">AI Assistant</p>
                    <Chip
                      className="mt-2 border border-[#dceeff] bg-[#f4fbff] text-[#4f5968]"
                      radius="sm"
                      size="sm"
                      startContent={<span className="ml-1 h-2 w-2 rounded-full bg-[#20a8f3]"></span>}
                      variant="flat"
                    >
                      Online
                    </Chip>
                  </div>
                </div>

                <Button
                  aria-label="Close chat"
                  className="min-w-0 border border-[#eef1f5] bg-white text-[#6b7280] hover:bg-[#f4fbff] hover:text-[#169eea]"
                  isIconOnly
                  radius="full"
                  size="sm"
                  variant="flat"
                  onPress={() => setIsOpen(false)}
                >
                  <X size={17} strokeWidth={2.2} />
                </Button>
              </CardHeader>

              <CardBody className="bg-[#fbfcfd] p-0">
                <div className="flex h-[23rem] flex-col">
                  <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4" ref={messagesRef}>
                    {messages.map((message) => (
                      <MessageBubble key={message.id} role={message.role} text={message.text} />
                    ))}

                    {isResponding ? (
                      <div className="flex items-end gap-2">
                        <AssistantBadge />
                        <div className="rounded-lg rounded-bl-sm border border-[#eef1f5] bg-white px-4 py-3 shadow-[0_16px_34px_-30px_rgba(17,24,39,0.5)]">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 animate-bounce rounded-full bg-[#20a8f3] [animation-delay:-0.2s]"></span>
                            <span className="h-2 w-2 animate-bounce rounded-full bg-[#8dd7ff] [animation-delay:-0.1s]"></span>
                            <span className="h-2 w-2 animate-bounce rounded-full bg-[#c7eefe]"></span>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <form
                    className="border-t border-[#eef1f5] bg-white px-3 py-3"
                    onSubmit={handleSubmit}
                  >
                    <div className="flex items-center gap-2">
                      <Button
                        aria-label="Attach file"
                        className="min-w-0 border border-[#eef1f5] bg-[#fbfcfd] text-[#7a8494] hover:bg-[#f4fbff] hover:text-[#169eea]"
                        isIconOnly
                        radius="full"
                        size="sm"
                        variant="flat"
                      >
                        <Paperclip size={15} strokeWidth={2.1} />
                      </Button>

                      <Input
                        ref={inputRef}
                        aria-label="Type a message"
                        className="flex-1"
                        classNames={{
                          base: "w-full",
                          inputWrapper:
                            "h-11 rounded-lg border border-[#eef1f5] bg-[#fbfcfd] shadow-none data-[hover=true]:bg-[#f4fbff] group-data-[focus=true]:bg-white group-data-[focus=true]:border-[#20a8f3]",
                          input: "text-sm text-[#181f2c] placeholder:text-[#9aa3af]",
                        }}
                        placeholder="Type a message..."
                        radius="sm"
                        value={draft}
                        variant="flat"
                        onValueChange={setDraft}
                      />

                      <Button
                        aria-label="Send message"
                        className="min-w-0 bg-[#20a8f3] text-white shadow-[0_18px_34px_-26px_rgba(32,168,243,0.8)] hover:bg-[#0c98e5]"
                        isDisabled={!draft.trim() || isResponding}
                        isIconOnly
                        radius="sm"
                        type="submit"
                      >
                        <SendHorizontal size={16} strokeWidth={2.2} />
                      </Button>
                    </div>
                  </form>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Button
        aria-controls="billifty-chat-widget"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="pointer-events-auto h-14 w-14 min-w-0 rounded-full border border-[#dceeff] bg-white text-[#169eea] shadow-[0_20px_44px_-26px_rgba(17,24,39,0.5)] transition-transform duration-200 hover:scale-[1.02] hover:bg-[#f4fbff]"
        isIconOnly
        onPress={() => setIsOpen((current) => !current)}
      >
        {isOpen ? <X size={24} strokeWidth={2.2} /> : <MessageCircleMore size={24} strokeWidth={2.2} />}
      </Button>
    </div>
  );
}
