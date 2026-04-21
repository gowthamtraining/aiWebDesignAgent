import { ChatStatus, UIMessage } from 'ai';
import React from 'react'
import { PromptInputMessage } from '../ai-elements/prompt-input';
import { Conversation, ConversationContent, ConversationEmptyState } from '../ai-elements/conversation';
import ChatInput from './chat-input';
import { Skeleton } from '../ui/skeleton';
import { Message, MessageContent, MessageResponse } from '../ai-elements/message';
import { Attachment, AttachmentPreview, Attachments } from '../ai-elements/attachments';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircleIcon, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Spinner } from '../ui/spinner';
import { PageType } from '@/types/project';

type PropsType = {
    className?: string;
    input: string;
    isLoading: boolean;
    isProjectLoading?: boolean;
    setInput: (input: string) => void;
    messages: UIMessage[];
    error?: Error;
    onStop: () => void;
    onSubmit: (message: PromptInputMessage, options?: any) => void;
    status: ChatStatus;
    selectedPage?: PageType
}

const ChatPanel = ({
    className,
    input,
    isLoading,
    setInput,
    messages,
    onStop,
    onSubmit,
    status,
    error,
    isProjectLoading,
    selectedPage
}: PropsType) => {
    return (
        <div className="relative flex flex-col flex-1 overflow-hidden">
            <Conversation className={cn("flex-1 overflow-y-auto", className)}>
                <ConversationContent>
                    {isProjectLoading ? (
                        <div className='flex flex-col gap-3 p-4'>
                            <Skeleton className='w-full h-5 rounded-lg' />
                            <Skeleton className='w-3/4 h-4 rounded-lg' />
                            <Skeleton className='w-1/2 h-4 rounded-lg' />
                        </div>
                    ) : messages.length === 0 ? (
                        <ConversationEmptyState />
                    ) : messages?.map((message, msgIndex) => {
                        const attachmentsFromMessage = message.parts.filter(
                            (part) => part.type === "file"
                        )
                        return (
                            <React.Fragment key={message.id}>
                                <Message from={message.role}>
                                    <MessageContent className="text-[13.5px] leading-relaxed">
                                        {attachmentsFromMessage.length > 0 && (
                                            <Attachments variant="grid">
                                                {attachmentsFromMessage.map((part, i) => {
                                                    const id = `${message.id}-file-${i}`
                                                    const attachmentData = { ...part, id }
                                                    return (
                                                        <Attachment
                                                            data={attachmentData}
                                                            key={id}
                                                            className="size-20 border-primary/10"
                                                        >
                                                            <AttachmentPreview />
                                                        </Attachment>
                                                    )
                                                })}
                                            </Attachments>
                                        )}

                                        {message.parts.map((part, i) => {
                                            switch (part.type) {
                                                case "text":
                                                    return (
                                                        <div
                                                            key={`${message.id}-text-${i}`}
                                                            className="flex items-start gap-2">
                                                            <MessageResponse>
                                                                {part.text}
                                                            </MessageResponse>
                                                        </div>
                                                    )
                                                case "data-generation":
                                                    const data = (part as any).data;
                                                    return (
                                                        <GenerationCard
                                                            key={`${message.id}-gen-${i}`}
                                                            status={data.status}
                                                            pages={data.pages}
                                                            currentPageId={data.currentPageId}
                                                            regeneratePage={data.regeneratePage}
                                                        />
                                                    )

                                                default:
                                                    return null;
                                            }
                                        })}
                                    </MessageContent>
                                </Message>
                            </React.Fragment>
                        )
                    })}

                    {isLoading ? (
                        <div className="flex items-center gap-2 px-4 py-2 text-muted-foreground text-xs">
                            <Loader2 size={12} className="animate-spin" />
                            <span>Thinking…</span>
                        </div>
                    ) : null}

                    {status === "error" && error && (
                        <ErrorAlert
                            title="Something went wrong"
                            message="The AI failed to respond. Please try again."
                        />
                    )}

                </ConversationContent>
            </Conversation>

            {/* Input area */}
            <div className="p-3 border-t border-border bg-background">
                <ChatInput
                    input={input}
                    isLoading={isLoading}
                    status={status}
                    selectedPage={selectedPage}
                    setInput={setInput}
                    onStop={onStop}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    )
}


const ErrorAlert = ({ title, message }: {
    title: string;
    message: string;
}) => {
    return (
        <div className="mx-3 my-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 flex items-start gap-2 text-sm">
            <AlertCircleIcon className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
            <div>
                <p className="font-medium text-destructive">{title}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{message}</p>
            </div>
        </div>
    )
}

const GenerationCard = ({
    status,
    pages,
    currentPageId,
    regeneratePage
}: {
    status: 'analyzing' | 'generating' | 'regenerating' | 'canceled' | 'complete' | 'error';
    pages: { id: string, name: string, done: boolean }[]
    regeneratePage: { id: string, name: string, done: boolean }
    currentPageId?: string
}) => {
    const isComplete = status === "complete";
    const isAnalyzing = status === "analyzing";
    const isCanceled = status === "canceled";
    const isError = status === "error";
    const isRegenerating = status === "regenerating"

    const statusLabel = isAnalyzing
        ? 'Analyzing request…'
        : isCanceled
            ? 'Generation canceled'
            : isError
                ? 'Generation failed'
                : isRegenerating
                    ? `Regenerating ${regeneratePage?.name}…`
                    : isComplete
                        ? (regeneratePage
                            ? `Regenerated ${regeneratePage.name}`
                            : `Generated ${pages?.length} page${pages?.length !== 1 ? 's' : ''}`)
                        : `Generating ${pages?.length} page${pages?.length !== 1 ? 's' : ''}…`

    return (
        <div className={cn(
            "mx-2 my-2 rounded-xl border p-3.5 flex flex-col gap-3",
            "animate-in fade-in slide-in-from-bottom-2 duration-300",
            isError
                ? 'border-destructive/25 bg-destructive/5'
                : 'border-border bg-card'
        )}>
            {/* Status row */}
            <div className="flex items-center gap-2 text-sm font-medium">
                {isComplete ? (
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                ) : isCanceled || isError ? (
                    <AlertCircleIcon className="size-4 text-destructive shrink-0" />
                ) : (
                    <Spinner className="size-4 shrink-0" />
                )}
                <span className={cn(
                    "text-sm",
                    isError ? 'text-destructive' : isComplete ? 'text-foreground' : 'text-muted-foreground'
                )}>
                    {statusLabel}
                </span>
            </div>

            {/* Page list */}
            {pages?.length > 0 && (
                <div className="flex flex-col gap-1.5 pl-1">
                    {pages.map(page => {
                        const isGenerating = currentPageId === page.id;
                        return (
                            <div key={page.id} className="flex items-center gap-2.5 text-sm">
                                <div className="size-4 flex items-center justify-center shrink-0">
                                    {page.done
                                        ? <CheckCircle2 className="size-3.5 text-emerald-500" />
                                        : isGenerating
                                            ? <Spinner className="size-3.5" />
                                            : <Circle className="size-3 text-muted-foreground/30" />
                                    }
                                </div>
                                <span className={cn(
                                    "text-xs transition-colors",
                                    page.done ? 'text-muted-foreground line-through' :
                                        isGenerating ? 'text-foreground font-medium' :
                                            'text-muted-foreground'
                                )}>
                                    {page.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default ChatPanel