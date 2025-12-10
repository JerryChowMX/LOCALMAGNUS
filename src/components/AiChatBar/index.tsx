import React, { useState } from 'react';
import { AiChatBarCollapsed } from './AiChatBarCollapsed';
import { AiChatBarExpanded } from './AiChatBarExpanded';
import type { AiChatUsedProps } from '../../lib/analytics';

interface AiChatBarProps {
    context?: AiChatUsedProps['context'];
}

export const AiChatBar: React.FC<AiChatBarProps> = ({ context }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {!isOpen && <AiChatBarCollapsed onClick={() => setIsOpen(true)} />}
            {isOpen && <AiChatBarExpanded onClose={() => setIsOpen(false)} context={context} />}
        </>
    );
};
