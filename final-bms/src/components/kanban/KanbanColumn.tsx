import { Droppable, Draggable } from "@hello-pangea/dnd";
import KanbanCard from "./KanbanCard";

type Card = {
  id: number;
  title: string;
  status: string;
  profiles: { first_name: string, last_name: string } | null;
};

type TimeLog = {
  id: number;
  kanban_card_id: number;
  user_id: string;
  end_time: string | null;
};

type KanbanColumnProps = {
  status: string;
  cards: Card[];
  timeLogs: TimeLog[];
  currentUserId: string;
};

export default function KanbanColumn({ status, cards, timeLogs, currentUserId }: KanbanColumnProps) {
  return (
    <div className="w-80 bg-gray-100 rounded-lg shadow-md p-2 flex-shrink-0">
      <h2 className="text-lg font-semibold mb-4 p-2 capitalize">{status.replace("_", " ")}</h2>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[500px] transition-colors duration-200 p-2 ${
              snapshot.isDraggingOver ? "bg-gray-200" : ""
            }`}
          >
            {cards.map((card, index) => (
              <KanbanCard
                key={card.id}
                card={card}
                index={index}
                timeLogs={timeLogs.filter(t => t.kanban_card_id === card.id)}
                currentUserId={currentUserId}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
