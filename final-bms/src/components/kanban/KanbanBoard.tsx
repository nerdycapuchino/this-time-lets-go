"use client";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import KanbanColumn from "./KanbanColumn";
import { MilestoneApprovalModal } from "@/components/invoices/milestone-approval-modal";

type Card = {
  id: number;
  title: string;
  status: "backlog" | "todo" | "in_progress" | "in_review" | "done";
  profiles: { first_name: string, last_name: string } | null;
  amount?: number;
  project_name?: string;
};

type TimeLog = {
  id: number;
  kanban_card_id: number;
  user_id: string;
  end_time: string | null;
};

type KanbanBoardProps = {
  initialCards: Card[];
  timeLogs: TimeLog[];
  currentUserId: string;
};

// Define the columns
const columns: Card['status'][] = ["backlog", "todo", "in_progress", "in_review", "done"];

export default function KanbanBoard({ initialCards, timeLogs, currentUserId }: KanbanBoardProps) {
  const [cards, setCards] = useState(initialCards);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Card | null>(null);
  const [pendingMove, setPendingMove] = useState<{ draggableId: string; destinationId: string } | null>(null);

  // This onDragEnd is now purely for optimistic UI updates.
  // The actual status change should be handled by a server action.
  const onDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    // Intercept move to 'done' or 'approved' for invoicing
    if (destination.droppableId === "done" || destination.droppableId === "approved") {
      const card = cards.find((c) => c.id === parseInt(draggableId));
      if (card) {
        setSelectedMilestone(card);
        setPendingMove({ draggableId, destinationId: destination.droppableId });
        setIsModalOpen(true);
        return; // Prevent immediate update
      }
    }

    // Optimistically update the card's status
    executeMove(draggableId, destination.droppableId);
  };

  const executeMove = (draggableId: string, destinationId: string) => {
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === parseInt(draggableId)
          ? { ...card, status: destinationId as Card['status'] }
          : card
      )
    );
    // Here, you would call a server action to persist the status change
    // updateCardStatus(parseInt(draggableId), destinationId);
  };

  const handleModalClose = (isConfirmed: boolean = false) => {
    setIsModalOpen(false);
    if (isConfirmed && pendingMove) {
      executeMove(pendingMove.draggableId, pendingMove.destinationId);
    }
    setPendingMove(null);
    setSelectedMilestone(null);
  };

  return (
    <>
    <div className="flex space-x-4 overflow-x-auto p-2">
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            cards={cards.filter((c) => c.status === status)}
            timeLogs={timeLogs}
            currentUserId={currentUserId}
          />
        ))}
      </DragDropContext>
    </div>

    {selectedMilestone && (
      <MilestoneApprovalModal
        isOpen={isModalOpen}
        onClose={handleModalClose as any}
        milestone={{
          id: selectedMilestone.id,
          name: selectedMilestone.title,
          amount: selectedMilestone.amount || 0,
        }}
        projectName={selectedMilestone.project_name || "Project"}
      />
    )}
    </>
  );
}
