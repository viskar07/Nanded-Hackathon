// Enums
export type UserRole = "Admin" | "Faculty" | "Student";
export type Gender = "MALE" | "FEMALE";
export type StudentRoleType = "MaleClassRepresentative" | "FemaleClassRepresentative";
export type FacultyRoleType = "Admin" | "Finance" | "Registrar" | "FacilityIncharge" | "ComplaintModerator" | "ElectionManager";
export type FacultyDesignation = "Lecturer" | "Professor" | "HOD" | "Other";
export type OrganizationType = "Department" | "Club" | "CollegeEvent" | "Mess" | "Other";
export type OrganizationRole = "Treasurer" | "Member" | "Head";
export type SlotStatus = "Available" | "Booked" | "Other";
export type ApplicationStatus = "Pending" | "Approved" | "Rejected" | "Escalated" | "Other";
export type ComplaintStatus = "UnderReview" | "Resolved" | "Rejected" | "Other";
export type BudgetEntity = "Club" | "Department" | "Mess" | "CollegeEvent" | "Other";
export type BudgetStatus = "Pending" | "Approved" | "Rejected" | "Other";
export type ElectionStatus = "Hidden" | "Registration" | "Ongoing" | "Completed" | "Other";

// Models
export interface User {
  id: string;
  clerkId: string;
  email: string;
  role: UserRole;
  firstname: string;
  lastname: string;
}

export interface Institution {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  clerkOrganizationId: string | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  creatorId: string;
  creator: User;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  password: string;
  profile: string | null;
  bloodGroup: string | null;
  dob: Date | null;
  gender: Gender;
  role: StudentRoleType | null;
  classId: string | null;
  class: Class | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  parentName: string;
  parentMobile: string;
  parentEmail: string;
  institutionId: string;
  institution: Institution;
}

export interface Achievement {
  id: string;
  studentId: string;
  student: Student;
  name: string;
  certificateFile: string;
}

export interface Hobby {
  id: string;
  studentId: string;
  student: Student;
  hobby: string;
}

export interface StudentEvent {
  id: string;
  studentId: string;
  student: Student;
  name: string;
  description: string | null;
  timeline: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  password: string;
  designation: FacultyDesignation;
  departmentId?: string;
  department?: Department;
  classCoordinatorId?: string | null;
  classCoordinator?: Class | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  role: FacultyRoleType;
  institutionId: string;
  institution: Institution;
}

export interface Department {
  id: string;
  name: string;
  description: string | null;
  achievements: string | null;
  toppers: string | null;
  createdAt: Date;
  updatedAt: Date;
  institutionId: string;
  institution: Institution;
}

export interface Class {
  id: string;
  year: number;
  branch: string;
  coordinatorId: string | null;
  coordinator: Faculty | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassChat {
  id: string;
  message: string;
  mediaUrl: string | null;
  senderId: string;
  sender: Student;
  classId: string;
  class: Class;
  createdAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  description: string | null;
  type: OrganizationType;
  achievements: string | null;
  departmentId: string | null;
  department: Department | null;
  clubId: string | null;
  club: Club | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  institutionId: string;
  institution: Institution;
}

export interface Club {
  id: string;
  name: string;
  description: string | null;
  achievements: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrgChatMessage {
  id: string;
  message: string;
  senderId: string;
  sender: Student;
  organizationId: string;
  organization: Organization;
  createdAt: Date;
}

export interface Facility {
  id: string;
  name: string;
  description: string | null;
  images: string | null;
  managerId: string | null;
  manager: Faculty | null;
  shutdown: boolean;
  shutdownReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FacilitySlot {
  id: string;
  facilityId: string;
  facility: Facility;
  timing: string;
  date: Date;
  status: SlotStatus;
  bookedById: string | null;
  bookedBy: Student | null;
  reason: string | null;
  createdAt: Date;
}

export interface Application {
  id: string;
  title: string;
  description: string;
  type: string;
  sentTo: string;
  status: ApplicationStatus;
  rejectionReason: string | null;
  unread: boolean;
  timeline: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMembership {
  id: string;
  organizationId: string;
  organization: Organization;
  facultyId: string | null;
  faculty: Faculty | null;
  studentId: string | null;
  student: Student | null;
  role: OrganizationRole | null;
  startDate: Date;
  endDate: Date | null;
}

export interface Complaint {
  id: string;
  description: string;
  proof: string | null;
  status: ComplaintStatus;
  revealIdentity: boolean;
  votes: number;
  managerId: string | null;
  manager: Faculty | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  date: Date;
  facultyId: string | null;
  faculty: Faculty | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheatingRecord {
  id: string;
  studentId: string;
  student: Student;
  reason: string;
  proof: string | null;
  facultyId: string;
  faculty: Faculty;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  entity: BudgetEntity;
  status: BudgetStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetTransaction {
  id: string;
  budgetId: string;
  budget: Budget;
  title: string;
  amount: number;
  description: string | null;
  receipt: string | null;
  verified: boolean;
  rejectedReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  id: string;
  message: string;
  postedBy: string;
  reactions: string | null;
  pollOptions: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ElectionsList {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Election {
  id: string;
  title: string;
  description: string | null;
  status: ElectionStatus;
  startTime: Date;
  endTime: Date;
  createdById: string;
  createdBy: Faculty;
  createdAt: Date;
  updatedAt: Date;
  electionsListId: string | null;
  electionsList: ElectionsList | null;
}

export interface Candidate {
  id: string;
  studentId: string;
  student: Student;
  manifesto: string | null;
  position: string;
  electionId: string;
  election: Election;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vote {
  id: string;
  candidateId: string;
  candidate: Candidate;
  voterId: string;
  voter: Student;
  electionId: string;
  election: Election;
  createdAt: Date;
  updatedAt: Date;
}

export interface FacilityReview {
  id: string;
  facilityId: string;
  facility: Facility;
  rating: number;
  comment: string | null;
  studentId: string;
  student: Student;
  createdAt: Date;
  updatedAt: Date;
}

export interface Poll {
  id: string;
  question: string;
  options: string[];
  facultyId: string;
  faculty: Faculty;
  createdAt: Date;
  updatedAt: Date;
}

export interface PollResponse {
  id: string;
  pollId: string;
  poll: Poll;
  studentId: string;
  student: Student;
  selectedOption: string;
  createdAt: Date;
  updatedAt: Date;
}
