import React, {useState} from 'react';
import ReactMarkdown from 'react-markdown';
import {Check, Copy} from 'lucide-react';
import {motion} from 'framer-motion';
import {copyToClipboard} from '../../lib/utils';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';

interface MarkdownRendererProps {
    content: string;
    onCopy?: (code: string) => void;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
                                                                      content,
                                                                      onCopy,
                                                                  }) => {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = async (code: string, index: number) => {
        const success = await copyToClipboard(code);
        if (success) {
            setCopiedIndex(index);
            onCopy?.(code);
            setTimeout(() => setCopiedIndex(null), 2000);
        }
    };

    return (
        <div className="max-w-none">
            <ReactMarkdown
                rehypePlugins={[[rehypeHighlight, {detect: true, ignoreMissing: true}]]}
                components={{
                    p: ({node, ...props}) => (
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed my-2" {...props} />
                    ),
                    h1: ({node, ...props}) => (
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-4 mb-2" {...props} />
                    ),
                    h2: ({node, ...props}) => (
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-3 mb-2" {...props} />
                    ),
                    h3: ({node, ...props}) => (
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 mb-1" {...props} />
                    ),
                    ul: ({node, ...props}) => (
                        <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 my-2" {...props} />
                    ),
                    ol: ({node, ...props}) => (
                        <ol className="list-decimal list-inside text-slate-700 dark:text-slate-300 my-2" {...props} />
                    ),
                    li: ({node, ...props}) => (
                        <li className="ml-2 text-slate-700 dark:text-slate-300" {...props} />
                    ),
                    blockquote: ({node, ...props}) => (
                        <blockquote
                            className="border-l-4 border-primary-500 pl-4 py-2 my-2 italic text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded"
                            {...props}
                        />
                    ),
                    pre: ({node, children, ...props}: any) => {
                        // Extract language from className
                        let language = 'text';
                        const firstChild = Array.isArray(children) ? children[0] : children;
                        if (firstChild && typeof firstChild === 'object' && 'props' in firstChild) {
                            const match = /language-(\w+)/.exec(firstChild.props.className || '');
                            language = match ? match[1] : 'text';
                        }

                        const codeString = String(firstChild?.props?.children || '').replace(/\n$/, '');
                        const index = Math.random();

                        return (
                            <div className="relative my-4 group">
                                {/* Language Label */}
                                <div
                                    className="flex items-center justify-between bg-slate-800 dark:bg-slate-900 px-4 py-2 rounded-t-lg border-b border-slate-700 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    {language}
                  </span>
                                    <motion.button
                                        whileHover={{scale: 1.1}}
                                        whileTap={{scale: 0.95}}
                                        onClick={() => handleCopy(codeString, index as any)}
                                        className="flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md transition-colors text-xs font-medium text-slate-200"
                                        aria-label="Copy code"
                                    >
                                        {copiedIndex === index ? (
                                            <>
                                                <Check className="w-4 h-4 text-green-400"/>
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4"/>
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>

                                {/* Code Block */}
                                <pre className="bg-slate-900 dark:bg-slate-950 rounded-b-lg overflow-x-auto p-4 !m-0" {...props}>
                  {children}
                </pre>
                            </div>
                        );
                    },
                    code: ({node, inline, ...props}: any) => {
                        if (inline) {
                            return (
                                <code
                                    className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-sm text-slate-900 dark:text-slate-100 font-mono"
                                    {...props}
                                />
                            );
                        }
                        return <code {...props} />;
                    },
                    a: ({node, href, ...props}: any) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 underline"
                            {...props}
                        />
                    ),
                    table: ({node, ...props}) => (
                        <div className="overflow-x-auto my-4">
                            <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-600" {...props} />
                        </div>
                    ),
                    th: ({node, ...props}) => (
                        <th className="border border-slate-300 dark:border-slate-600 px-4 py-2 bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white" {...props} />
                    ),
                    td: ({node, ...props}) => (
                        <td className="border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-700 dark:text-slate-300" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
