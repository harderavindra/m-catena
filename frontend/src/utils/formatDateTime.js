import { format } from "date-fns";

export const formatDateTime = (dateString) => {
  return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
};