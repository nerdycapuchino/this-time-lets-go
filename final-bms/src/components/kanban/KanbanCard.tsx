import { Draggable } from "@hello-pangea/dnd";
import { startTimer, stopTimer } from "@/app/actions/timeTracking";
import { Timer, User } from "lucide-react";

type Card = {
  id: number;
  title: string;
  profiles: { first_name: string, last_name: string } | null;
};

type TimeLog = {
  id: number;
  user_id: string;
  end_time: string | null;
  duration_minutes?: number | null;
};

type KanbanCardProps = {
  card: Card;
  index: number;
  timeLogs: TimeLog[];
  currentUserId: string;
};

export default function KanbanCard({ card, index, timeLogs, currentUserId }: KanbanCardProps) {
  const activeLog = timeLogs.find(t => t.end_time === null);
  const isTimingByCurrentUser = activeLog?.user_id === currentUserId;
  const totalDuration = timeLogs.reduce((acc, log) => acc + (log.duration_minutes || 0), 0);

  const handleStartTimer = async () => {
    await startTimer(card.id);
  };

  const handleStopTimer = async () => {
    if (activeLog) {
      await stopTimer(activeLog.id);
    }
  };

  return (
    <Draggable draggableId={String(card.id)} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white dark:bg-zinc-900 rounded-2xl neu-shadow p-5 mb-4 border border-white/10 dark:border-white/5 transition-all ${
            snapshot.isDragging ? "scale-105 rotate-2 z-50 shadow-2xl" : ""
          }`}
        >
          <p className="font-bold text-gray-900 dark:text-white mb-2">{card.title}</p>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-2">
              <User className="w-3 h-3 text-blue-600" />
            </div>
            <span className="font-medium">{card.profiles?.first_name} {card.profiles?.last_name}</span>
          </div>

          <div className="pt-4 border-t border-gray-50 dark:border-white/5 flex justify-between items-center text-xs">
            <div className="flex items-center text-gray-500 font-medium">
                <Timer className="w-4 h-4 mr-1.5 text-blue-500" />
                <span>{totalDuration} min</span>
            </div>
            {isTimingByCurrentUser ? (
                <button onClick={handleStopTimer} className="shimmer-button bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Stop</button>
            ) : activeLog ? (
                <div className="px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 rounded-full font-bold text-[10px] uppercase tracking-wider">In Progress</div>
            ) : (
                <button onClick={handleStartTimer} className="shimmer-button bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Start</button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
