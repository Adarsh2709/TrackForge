export interface Issue {
  id: string;
  title: string;
  description: string;
  type: "Bug" | "Feature" | "Enhancement" | "Task";
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "In Review" | "Resolved" | "Closed";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  email: string;
  role: string;
  token: string;
}
