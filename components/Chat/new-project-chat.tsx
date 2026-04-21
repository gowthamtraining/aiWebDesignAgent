import { ChatStatus } from "ai";
import { PromptInputMessage } from "../ai-elements/prompt-input";
import { motion } from "motion/react"
import Link from 'next/link';
import { Suggestion, Suggestions } from "../ai-elements/suggestion";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ChatInput from "./chat-input";
import { Trash2, Sparkles, ExternalLink } from "lucide-react";

type PropsType = {
    input: string;
    isLoading: boolean;
    status: ChatStatus;
    setInput: (input: string) => void;
    onStop: () => void;
    onSubmit: (message: PromptInputMessage, options?: any) => void;
}

const GRADIENT_PRESETS = [
    "from-violet-500/20 via-purple-500/10 to-blue-500/20",
    "from-blue-500/20 via-cyan-500/10 to-teal-500/20",
    "from-rose-500/20 via-pink-500/10 to-orange-500/20",
    "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
    "from-amber-500/20 via-yellow-500/10 to-orange-500/20",
];

const NewProjectChat = ({
    input,
    isLoading,
    status,
    setInput,
    onStop,
    onSubmit
}: PropsType) => {
    const suggestions = [
        {
            label: "Modern HR SaaS Landing Page",
            value: "A clean, high-conversion B2B SaaS landing page for an HR and Payroll platform. The color palette features a vibrant royal blue primary color, bright yellow accent for CTA buttons, and alternating solid blue and ultra-light gray background sections. The hero section must have a solid blue background with a faint grid mesh, centered bold typography, and a massive overlapping 'bento-style' composition of floating white UI dashboard cards showing mock payroll data and SVG charts. Include a 3-column bento grid for features with mini UI elements, a 2-column section with a stylized SVG globe, a horizontal timeline-based pricing section on a blue background, a 3-column testimonials grid, and a massive bright yellow rounded CTA banner nested just above a clean footer."
        },
        {
            label: "AI SaaS Landing Page",
            value: "A cutting-edge landing page for an autonomous AI workflow platform. Deep space dark mode with vibrant indigo radial light-leaks, floating glassmorphic navbar, hero with glowing gradient text, bento grid showcasing features, and Forge pricing section."
        },
        {
            label: "B2B SaaS Landing",
            value: "A serious B2B SaaS marketing site with structured hero, client logos strip (Vercel, Linear, Notion, Stripe), feature sections with diagrams, data visualization preview, pricing tiers, FAQ accordion, and enterprise call-to-action. Clear hierarchy and strong spacing rhythm."
        },
        {
            label: "Sales Landing",
            value: "A high-contrast, modern B2B SaaS Sales landing page. The theme uses a crisp white background, deep navy/purple-black for inverted containers, and a vibrant Lime Green primary accent. The Hero features a bold H1 with an inline circular icon, next to a floating composition of white and lime-green UI dashboard cards with SVG bar charts. Below the hero is a massive, dark navy rounded-3xl container housing a 2x2 features grid with pill-shaped badges. Follow this with a complex 3-row white bento grid showcasing UI mockups (SVG maps, bar charts, and an overlapping dark stat card). Include a 'How it Works' section with a vertical numbered timeline alongside overlapping login UI mockups. Finish with a dark navy 3-column pricing container and a bright lime-green rounded CTA banner just above a clean, light footer."
        },
        {
            label: "FinTech Landing",
            value: "A Dribbble-quality landing page for a modern global payments app. The theme alternates between a deep, dark forest/emerald green and pristine white. The primary accent color is a vibrant neon Emerald Green. The Hero section is dark mode with an emerald radial light-leak, featuring a centered massive H1, a floating UI card representing a mobile banking interface, and smaller glassmorphic pill badges floating around it (e.g., 'Total Balance'). Follow this with a pristine white section containing a muted partner logo cloud, a 6-card bento grid for features with green icons, and two 2-column split sections matching text/checklists against large floating white UI cards. Include a dark-mode pricing section with 3 glassmorphic cards and emerald accents, a white testimonials grid, and a massive dark-green rounded CTA card with an inner radial glow placed just above a Forge, dark-mode footer."
        },
        {
            label: "Crypto Exchange",
            value: "A futuristic trading interface for a crypto exchange called 'Apex'. Deep midnight background with electric blue glows. Central trading chart with candlesticks, left order book panel, right trade history, top navbar with BTC $67,432 ETH $3,241 live prices, and glowing buy/sell buttons."
        },
        {
            label: "Payment Platform",
            value: "A high-conversion landing page for a payment link product. Strong hero with 'Accept Payments Instantly' headline, live payment preview mockup on the right, trust badges, feature grid explaining no-code checkout, use-case sections (Creators, SaaS, Freelancers), pricing comparison, and a bold CTA. Clean fintech-grade design."
        },
        {
            label: "Neobank Website",
            value: "A modern neobank marketing website. Confident hero with app preview, trust metrics row showing '2M+ users', '$4.2B processed', debit card showcase section, feature breakdown grid, comparison table vs traditional banks, testimonials, and strong sign-up CTA."
        },
    ];

    const handleSuggestionClick = (value: string) => {
        setInput(value);
    };

    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-background">
            {/* Subtle ambient glow — adapts via opacity to both themes */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-[-8%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute top-[30%] left-[10%] w-[350px] h-[350px] rounded-full bg-primary/4 blur-[100px]" />
                <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-primary/4 blur-[100px]" />
                {/* Subtle dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
                        backgroundSize: "32px 32px",
                    }}
                />
            </div>

            <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-20">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="flex justify-center mb-6"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/8 text-primary text-xs font-medium tracking-wide">
                        <Sparkles size={12} />
                        AI-Powered Web Design
                    </span>
                </motion.div>

                {/* Hero Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 80 }}
                    className="text-center font-serif tracking-tight mb-5 text-foreground"
                    style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", lineHeight: 1.08 }}
                >
                    Design your website with AI
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center text-muted-foreground text-lg mb-8 max-w-lg mx-auto leading-relaxed"
                >
                    Describe your vision, and watch Forge transform
                    your ideas into a stunning web design.
                </motion.p>

                {/* Chat Input */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="w-full max-w-2xl mx-auto mb-6"
                >
                    <ChatInput
                        input={input}
                        isLoading={isLoading}
                        status={status}
                        setInput={setInput}
                        onStop={onStop}
                        onSubmit={onSubmit}
                    />
                </motion.div>

                {/* Suggestion chips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full max-w-3xl mx-auto"
                >
                    <Suggestions className="justify-center flex-wrap gap-2">
                        {suggestions.map((item) => (
                            <Suggestion
                                key={item.label}
                                className="font-normal text-xs"
                                suggestion={item.value}
                                onClick={() => handleSuggestionClick(item.value)}
                            >
                                {item.label}
                            </Suggestion>
                        ))}
                    </Suggestions>
                </motion.div>

                {/* Project Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="mt-16"
                >
                    <ProjectGrid />
                </motion.div>
            </div>
        </div>
    )
}

const ProjectGrid = () => {
    const queryClient = useQueryClient();
    const { data: projects, isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            const res = await fetch(`/api/project`);
            if (!res.ok) return [];
            return res.json() as Promise<{
                id: string;
                title: string;
                slugId: string;
                createdAt: string
            }[]>
        }
    })

    const deleteMutation = useMutation({
        mutationFn: async (slugId: string) => {
            const res = await fetch(`/api/project/${slugId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete project');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project deleted');
        },
        onError: () => toast.error('Failed to delete project'),
    });

    const handleDelete = (e: React.MouseEvent, slugId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Delete this project? This cannot be undone.')) {
            deleteMutation.mutate(slugId);
        }
    };

    if (isLoading) return <ProjectGridSkeleton />;
    if (!projects || projects.length === 0) return null;

    return (
        <div className="w-full">
            {/* Section divider */}
            <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">
                    Recent Projects
                </span>
                <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {projects.map((project, i) => {
                    const gradient = GRADIENT_PRESETS[i % GRADIENT_PRESETS.length];
                    return (
                        <div key={project.id} className="group relative flex flex-col gap-2">
                            <Link href={`/project/${project.slugId}`} className="block">
                                {/* Card thumbnail */}
                                <div className="aspect-4/3 rounded-2xl overflow-hidden relative border border-border hover:border-primary/50 transition-all duration-300 bg-muted">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

                                    {/* Initial letter */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-3xl font-serif italic text-foreground/20 select-none">
                                            {project.title.charAt(0)}
                                        </span>
                                    </div>

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-300 flex items-center justify-center">
                                        <ExternalLink
                                            size={16}
                                            className="text-foreground opacity-0 group-hover:opacity-40 transition-opacity"
                                        />
                                    </div>
                                </div>

                                <h4 className="text-sm font-medium text-foreground truncate px-1 mt-1">
                                    {project.title}
                                </h4>
                                <p className="text-xs text-muted-foreground px-1 -mt-1">
                                    {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                            </Link>

                            {/* Delete button */}
                            <button
                                onClick={(e) => handleDelete(e, project.slugId)}
                                disabled={deleteMutation.isPending}
                                className="absolute top-2 right-2 p-1.5 rounded-lg bg-background/90 backdrop-blur-sm border border-border opacity-0 group-hover:opacity-100 transition-all duration-200 hover:border-destructive/50 hover:text-destructive text-muted-foreground"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ProjectGridSkeleton = () => (
    <div className="w-full animate-pulse">
        <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-border" />
            <div className="h-3 w-32 bg-muted rounded" />
            <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                    <div className="aspect-4/3 rounded-2xl bg-muted border border-border" />
                    <div className="h-3 w-20 bg-muted rounded mx-1" />
                    <div className="h-2 w-12 bg-muted rounded mx-1" />
                </div>
            ))}
        </div>
    </div>
);

export default NewProjectChat