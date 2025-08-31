export const formatChatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const isSameDay = date.toDateString() === now.toDateString();
  if (isSameDay) return "Today";

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }); // e.g., "13 Jul, 2025"
};
