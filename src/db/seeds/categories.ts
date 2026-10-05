export type DefaultCategory = {
  id: string;
  name: string;
  type: "incoming" | "expense";
};

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  { id: "default-salary", name: "Salary", type: "incoming" },
  { id: "default-freelance", name: "Freelance", type: "incoming" },
  { id: "default-investment", name: "Investment", type: "incoming" },
  { id: "default-gift", name: "Gift", type: "incoming" },
  { id: "default-other-income", name: "Other", type: "incoming" },

  { id: "default-food", name: "Food", type: "expense" },
  { id: "default-transport", name: "Transport", type: "expense" },
  { id: "default-housing", name: "Housing", type: "expense" },
  { id: "default-health", name: "Health", type: "expense" },
  { id: "default-entertainment", name: "Entertainment", type: "expense" },
  { id: "default-education", name: "Education", type: "expense" },
  { id: "default-other-expense", name: "Other", type: "expense" },
];
