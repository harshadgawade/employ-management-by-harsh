import React from 'react';

export default function HRSocialFeed() {
  const posts = [
    {
      author: 'HR Communications',
      time: '2 hours ago',
      title: '🚀 Q3 All-Hands Meeting & Strategy Announcement',
      body: 'We are excited to share our latest product growth milestones. Join the webinar link on the calendar tab this Friday!',
      likes: 24,
      tag: 'Announcement'
    },
    {
      author: 'Tech Department Lead',
      time: '1 day ago',
      title: '👏 Peer Shout-out to Frontend Team',
      body: 'Kudos to the entire UI design team for delivering the new Neumorphic dashboard templates ahead of schedule!',
      likes: 42,
      tag: 'Achievement'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-3xl card-shadow border border-gray-100 space-y-4">
      <h3 className="font-bold text-gray-900">HR Social Feed & Announcements</h3>
      
      <div className="space-y-3">
        {posts.map((post, idx) => (
          <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-purple-600">{post.author}</span>
              <span className="text-gray-400 text-[10px]">{post.time}</span>
            </div>
            <h4 className="text-xs font-bold text-gray-800">{post.title}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{post.body}</p>
            <div className="flex items-center justify-between pt-2 text-[11px]">
              <span className="text-gray-400 font-medium">❤️ {post.likes} Acknowledgements</span>
              <span className="bg-purple-100 text-purple-600 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                {post.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}