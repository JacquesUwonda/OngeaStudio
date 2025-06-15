export type FlashcardData = {
  id: string;
  french: string;
  english: string;
  category?: string;
};

export const flashcards: FlashcardData[] = [
  { id: "1", french: "Bonjour", english: "Hello", category: "Greetings" },
  { id: "2", french: "Merci", english: "Thank you", category: "Politeness" },
  { id: "3", french: "Oui", english: "Yes", category: "Basics" },
  { id: "4", french: "Non", english: "No", category: "Basics" },
  { id: "5", french: "Chat", english: "Cat", category: "Animals" },
  { id: "6", french: "Chien", english: "Dog", category: "Animals" },
  { id: "7", french: "Maison", english: "House", category: "Places" },
  { id: "8", french: "Livre", english: "Book", category: "Objects" },
  { id: "9", french: "Manger", english: "To eat", category: "Verbs" },
  { id: "10", french: "Boire", english: "To drink", category: "Verbs" },
  { id: "11", french: "École", english: "School", category: "Places" },
  { id: "12", french: "Voiture", english: "Car", category: "Objects" },
  { id: "13", french: "Eau", english: "Water", category: "Food & Drink" },
  { id: "14", french: "Pain", english: "Bread", category: "Food & Drink" },
  { id: "15", french: "Au revoir", english: "Goodbye", category: "Greetings" },
  { id: "16", french: "S'il vous plaît", english: "Please", category: "Politeness" },
  { id: "17", french: "Comment ça va ?", english: "How are you?", category: "Greetings" },
  { id: "18", french: "Bien", english: "Good / Well", category: "Basics" },
  { id: "19", french: "Aujourd'hui", english: "Today", category: "Time" },
  { id: "20", french: "Demain", english: "Tomorrow", category: "Time" },
];
