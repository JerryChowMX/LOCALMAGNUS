import type { Comment } from '../components/Comments/types';

export const MOCK_COMMENTS: Comment[] = [
    {
        id: 'c1',
        author: 'Ricardo Morales',
        role: 'Subscriber',
        date: '2 hours ago',
        content: 'This is a fantastic article! The analysis on the economic trends in Monterrey is spot on. I particularly agreed with the point about infrastructure development.',
        likes: 24,
        isLiked: true,
        dislikes: 2,
        isDisliked: false
    },
    {
        id: 'c2',
        author: 'Ana G.',
        date: '45 mins ago',
        content: 'Great read! 👏',
        likes: 5,
        dislikes: 0
    },
    {
        id: 'c3',
        author: 'Fernando T.',
        role: 'Guest',
        date: '5 hours ago',
        content: 'While I understand the perspective, I think the author missed a crucial detail regarding the environmental impact. We cannot just focus on growth without considering sustainability. Ideally, we should see a follow-up piece addressing these concerns specifically.',
        likes: 12,
        dislikes: 1
    },
    {
        id: 'c4',
        author: 'Sofia Martinez',
        role: 'Admin',
        date: '1 hour ago',
        content: 'Thanks for the feedback everyone. We are planning a series of articles to cover the environmental aspects next week. Stay tuned!',
        likes: 45,
        dislikes: 0,
        replies: [
            {
                id: 'c4-r1',
                author: 'Carlos D.',
                date: '30 mins ago',
                content: 'That is good news. Looking forward to it.',
                likes: 3,
                dislikes: 0
            }
        ]
    }
];
