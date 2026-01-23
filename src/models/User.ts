// ...existing code...

interface UserSubscription {
  planId: 'basic' | 'standard' | 'premium';
  planName: string;
  price: number;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  startDate?: Date;
  endDate?: Date;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentId?: string;
  autoRenew: boolean;
}

// Add to User interface/schema:
// subscription?: UserSubscription;
// hasActiveSubscription: boolean;

export enum UserRole {
  Student = 'student',
  Instructor = 'instructor',
  CourseUploader = 'course_uploader',
}

export interface User {
  // ...existing fields...
  role: UserRole;
}

export interface User {
  // ...existing fields...
  role: UserRole;
}