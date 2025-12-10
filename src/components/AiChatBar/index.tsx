import React, { useState } from 'react';
import { AiChatBarCollapsed } from './AiChatBarCollapsed';
import { AiChatBarExpanded } from './AiChatBarExpanded';
import { AiCommentsExpanded } from './AiCommentsExpanded';
import type { AiChatUsedProps } from '../../lib/analytics';

interface AiChatBarProps {
    context?: AiChatUsedProps['context'];
}

type ActiveView = 'none' | 'chat' | 'comments';

export const AiChatBar: React.FC<AiChatBarProps> = ({ context }) => {
    const [activeView, setActiveView] = useState<ActiveView>('none');

    const handleClose = () => setActiveView('none');

    return (
        <>
            {activeView === 'none' && (
                <AiChatBarCollapsed
                    onChatClick={() => setActiveView('chat')}
                    onCommentsClick={() => setActiveView('comments')}
                />
            )}
            {activeView === 'chat' && (
                <AiChatBarExpanded onClose={handleClose} context={context} />
            )}
            {activeView === 'comments' && (
                <AiCommentsExpanded onClose={handleClose} />
            )}
        </>
    );
};
