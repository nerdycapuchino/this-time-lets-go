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
          className={`bg-white rounded-md shadow-sm p-4 mb-4 ${
            snapshot.isDragging ? "ring-2 ring-black" : ""
          }`}
        >
          <p className="font-semibold">{card.title}</p>
          <div className="flex items-center text-xs text-gray-500 mt-2">
            <User className="w-4 h-4 mr-1" />
            <span>{card.profiles?.first_name} {card.profiles?.last_name}</span>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center text-sm">
                <div className="flex items-center text-gray-600">
                    <Timer className="w-4 h-4 mr-1" />
                    <span>{totalDuration} min</span>
                </div>
                {isTimingByCurrentUser ? (
                    <button onClick={handleStopTimer} className="bg-red-500 text-white text-xs px-2 py-1 rounded">Stop</button>
                ) : activeLog ? (
                    <div className="text-xs text-yellow-600">Timing...</div>
                ) : (
                    <button onClick={handleStartTimer} className="bg-gray-200 text-xs px-2 py-1 rounded">Start</button>
                )}
            </div>
          </div>

        </div>
      )}
    </Draggable>
  );
}
