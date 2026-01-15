
export enum SubmissionStatus {
  PENDING = 'PENDING',
  RECEIVED = 'RECEIVED',
  REJECTED = 'REJECTED'
}

export interface BookItem {
  title: string;
  type: string;
  authors: string;
  isbn?: string;
  quantity: number;
  publishedYear: number;
}

export interface BookSubmission {
  id: string;
  fullName: string;
  department: string; // Kafedra yoki Tashkilot nomi
  institution: string; // Muassasa nomi (JizzPI yoki boshqa)
  isExternal: boolean; // Tashqi foydalanuvchi ekanligi
  position: string;
  submissionDate: string; // Foydalanuvchi tomonidan tanlangan topshirish sanasi
  books: BookItem[];
  submittedAt: string; // Tizimga yuborilgan vaqt (metadata)
  status: SubmissionStatus;
  receivedAt?: string;
}

export type ViewType = 'staff' | 'admin';
