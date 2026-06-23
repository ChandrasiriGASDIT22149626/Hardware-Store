import React, { useEffect, useState } from 'react';
import { CheckCircle2Icon, InfoIcon, AlertTriangleIcon, Trash2Icon, XIcon } from 'lucide-react';

export type NotificationType = 'success' | 'info' | 'warning' | 'error' | 'delete';

export interface NotificationPayload {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
}

const defaultTitles: Record<NotificationType, string> = {
  success: 'Success',
  info: 'Muthuwadige Hardware ERP',
  warning: 'Attention',
  error: 'Error',
  delete: 'Deleted',
};

const iconMap: Record<NotificationType, typeof CheckCircle2Icon> = {
  success: CheckCircle2Icon,
  info: InfoIcon,
  warning: AlertTriangleIcon,
  error: AlertTriangleIcon,
  delete: Trash2Icon,
};

export const notify = (
  message: string,
  title?: string,
  type: NotificationType = 'info'
) => {
  const payload: NotificationPayload = {
    id: `notify-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: title || defaultTitles[type] || 'Notice',
    message,
    type,
  };

  window.dispatchEvent(new CustomEvent('app-notification', { detail: payload }));
};

export function Notifications() {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);

  useEffect(() => {
    const onNotification = (event: Event) => {
      const customEvent = event as CustomEvent<NotificationPayload>;
      const payload = customEvent.detail;
      setNotifications((current) => [payload, ...current].slice(0, 4));

      window.setTimeout(() => {
        setNotifications((current) => current.filter((n) => n.id !== payload.id));
      }, 5200);
    };

    window.addEventListener('app-notification', onNotification as EventListener);
    return () => {
      window.removeEventListener('app-notification', onNotification as EventListener);
    };
  }, []);

  const dismiss = (id: string) => {
    setNotifications((current) => current.filter((notif) => notif.id !== id));
  };

  return (
    <div className="fixed right-5 top-5 z-[120] flex w-full max-w-sm flex-col gap-4">
      {notifications.map((notification) => {
        const Icon = iconMap[notification.type] || InfoIcon;
        const isDanger = notification.type === 'error' || notification.type === 'warning' || notification.type === 'delete';

        return (
          <div
            key={notification.id}
            className={`overflow-hidden rounded-[1.75rem] border p-5 shadow-2xl transition-all duration-300 ${
              isDanger
                ? 'bg-red-50/95 border-red-200 text-red-700 ring-1 ring-red-100'
                : 'bg-slate-950/95 border-slate-800 text-slate-100 ring-1 ring-slate-700'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`mt-1 shrink-0 rounded-2xl p-3 ${
                isDanger ? 'bg-red-600/10 text-red-600' : 'bg-[#DAA520]/15 text-[#DAA520]'
              }`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.35em] text-current/70">
                      {notification.title}
                    </p>
                    <p className="mt-3 text-sm font-bold leading-6 text-current">{notification.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => dismiss(notification.id)}
                    className="rounded-full p-1 text-current/60 transition hover:text-current"
                    aria-label="Dismiss notification"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
