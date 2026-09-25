import React from 'react';
import { MessageCircle, Check } from 'lucide-react';
import { PatientNotification } from '../../../types';
import { cn } from '../../Doctor/ui/primitives';
import { Sheet, SectionLabel, EmptyState, relTime } from '../ui';

interface Props {
  open: boolean;
  onClose: () => void;
  notifications: PatientNotification[] | null;
  onRead: (id: string) => void;
}

const MessagesSheet: React.FC<Props> = ({ open, onClose, notifications, onRead }) => (
  <Sheet open={open} onClose={onClose} title="Messages">
    <div className="max-h-[70vh] space-y-2 overflow-y-auto">
      {notifications === null ? (
        <p className="py-10 text-center text-sm text-ink-400">Loading…</p>
      ) : notifications.length === 0 ? (
        <EmptyState icon={<MessageCircle size={22} />} title="No messages yet" hint="Reminders and updates from your clinic will appear here." />
      ) : (
        notifications.map((n) => {
          const unread = n.status !== 'READ';
          return (
            <button key={n.id} onClick={() => onRead(n.id)}
              className={cn('flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition-colors active:scale-[0.99]',
                unread ? 'border-ink-950/[0.06] bg-white' : 'border-transparent bg-cream-100')}>
              <span className={cn('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full', unread ? 'bg-ink-950 text-cream-50' : 'bg-ink-950/[0.06] text-ink-400')}>
                {unread ? <span className="h-2 w-2 rounded-full bg-current" /> : <Check size={12} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-ink-800">{n.title}</span>
                <span className="mt-1 block whitespace-pre-wrap text-xs leading-relaxed text-ink-500">{n.body}</span>
                <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-wider text-ink-300">
                  {n.category} · {relTime(n.createdAt)}
                </span>
              </span>
            </button>
          );
        })
      )}
    </div>
  </Sheet>
);

export default MessagesSheet;
