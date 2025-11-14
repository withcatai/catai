import React, {forwardRef, useCallback, useRef} from 'react';

interface GhostTextInputProps {
    value: string;
    onChange: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    onCompletion?: (text: string) => void;
    completion?: string;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    style?: React.CSSProperties;
}

export const GhostTextInput = forwardRef<HTMLDivElement, GhostTextInputProps>(
    (
        {
            value,
            onChange,
            onKeyDown,
            onCompletion,
            completion = '',
            disabled = false,
            placeholder = '',
            className = '',
            style = {},
        },
        ref
    ) => {
        const internalRef = useRef<HTMLDivElement>(null);
        const ghostLayerRef = useRef<HTMLDivElement>(null);

        // Use forwarded ref or internal ref
        const contentEditableRef = (ref as React.MutableRefObject<HTMLDivElement | null>) || internalRef;

        // Sync contenteditable with state
        const handleInput = useCallback(() => {
            const content = contentEditableRef.current?.textContent || '';
            onChange(content);

            // Request completion
            if (onCompletion && content.trim()) {
                onCompletion(content);
            }
        }, [onChange, onCompletion]);

        // Update contenteditable when value prop changes
        React.useEffect(() => {
            if (contentEditableRef.current && contentEditableRef.current.textContent !== value) {
                contentEditableRef.current.textContent = value;
            }
        }, [value, contentEditableRef]);

        // Sync ghost layer scroll with main input
        const handleScroll = useCallback(() => {
            if (contentEditableRef.current && ghostLayerRef.current) {
                ghostLayerRef.current.scrollTop = contentEditableRef.current.scrollTop;
                ghostLayerRef.current.scrollLeft = contentEditableRef.current.scrollLeft;
            }
        }, [contentEditableRef]);

        return (
            <div className="relative w-full" style={{display: 'inline-block'}}>
                {/* Ghost text background layer */}
                {completion && (
                    <div
                        ref={ghostLayerRef}
                        className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
                        style={{
                            zIndex: 0,
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word',
                            lineHeight: 'inherit',
                        }}
                    >
                        <div
                            className="px-5 py-4 text-sm"
                            style={{
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                                lineHeight: 'inherit',
                                fontFamily: 'inherit',
                            }}
                        >
                            {/* Invisible user text to align completion */}
                            <span style={{color: 'transparent', userSelect: 'none'}}>
                {value}
              </span>
                            {/* Gray completion text */}
                            <span
                                style={{
                                    color: '#9ca3af',
                                    opacity: 0.6,
                                    marginLeft: '0',
                                    fontSize: 'inherit',
                                    fontFamily: 'inherit',
                                }}
                            >
                {completion}
              </span>
                        </div>
                    </div>
                )}

                {/* Contenteditable input - transparent bg when completion exists */}
                <div
                    ref={contentEditableRef}
                    contentEditable={!disabled}
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onKeyDown={onKeyDown}
                    onScroll={handleScroll}
                    onClick={() => contentEditableRef.current?.focus()}
                    data-placeholder={!value ? placeholder : ''}
                    className={`relative w-full ${className}`}
                    style={{
                        zIndex: 10,
                        backgroundColor: completion ? 'transparent' : undefined,
                        ...style,
                    }}
                />
            </div>
        );
    }
);

GhostTextInput.displayName = 'GhostTextInput';
