
export type AuthFormProps = {
    id: string
    type: "email" | "text" | "password"
    inputType: "select" | "input"
    options?: { value: string; label: string; id: string }[]
    label?: string
    placeholder: string
    name: string,
  }
export type FacutyForm = {
    id: string
    type: "email" | "text" | "password"
    inputType: "select" | "input"|"textarea"
    options?: { value: string; label: string; id: string }[]
    label?: string
    placeholder: string
    name: string,
  }
  export type FormGeneratorProps = {
    id:string
    type?: "text" | "email" | "password" | "number";
    inputType: "select" | "input" | "textarea";
    options?: { value: string; label: string; id: string }[];
    label?: string;
    placeholder: string;
    name: string;
    lines?: number;
};


  export const SIGN_UP_FORM: AuthFormProps[] = [
    {
      id: "1",
      inputType: "input",
      placeholder: "First name",
      name: "firstname",
      type: "text",
    },
    {
      id: "2",
      inputType: "input",
      placeholder: "Last name",
      name: "lastname",
      type: "text",
    },
    {
      id: "3",
      inputType: "input",
      placeholder: "Email",
      name: "email",
      type: "email",
    },
    {
      id: "4",
      inputType: "input",
      placeholder: "Password",
      name: "password",
      type: "password",
    },
  ]
  
  export const SIGN_IN_FORM: AuthFormProps[] = [
    {
      id: "1",
      inputType: "input",
      placeholder: "Email",
      name: "email",
      type: "email",
    },
    {
      id: "4",
      inputType: "input",
      placeholder: "Password",
      name: "password",
      type: "password",
    },
  ]
  

  export const FACULTY_CREATION_FORM:FacutyForm[] = [
    {
      id: "1",
      inputType: "input",
      placeholder: "Full Name",
      name: "name",
      type: "text",
      label: "Full Name",
    },
    {
      id: "2",
      inputType: "input",
      placeholder: "Email",
      name: "email",
      type: "email",
      label: "Email",
    },
    {
      id: "3",
      inputType: "input",
      placeholder: "Password",
      name: "password",
      type: "password",
      label: "Password",
    },
    {
      id: "4",
      inputType: "select",
      placeholder: "Designation",
      name: "designation",
      label: "Designation",
      type:'text',
      options: [
        { id: "1", label: "Lecturer", value: "LECTURER" },
        { id: "2", label: "Assistant Professor", value: "ASSISTANT_PROFESSOR" },
        { id: "3", label: "Associate Professor", value: "ASSOCIATE_PROFESSOR" },
        { id: "4", label: "Professor", value: "PROFESSOR" },
        { id: "5", label: "Staff", value: "STAFF" },
      ],
      
    },
    {
      id: "5",
      inputType: "select",
      placeholder: "Role (Optional)",
      name: "role",
      label: "Role",
      type:'text',
      options: [
        { id: "1", label: "Admin", value: "ADMIN" },
        { id: "2", label: "Finance", value: "FINANCE" },
        { id: "3", label: "Registrar", value: "REGISTRAR" },
        { id: "4", label: "Facility Incharge", value: "FACILITY_INCHARGE" },
        { id: "5", label: "Complaint Moderator", value: "COMPLAINT_MODERATOR" },
        { id: "6", label: "Election Manager", value: "ELECTION_MANAGER" },
        { id: "7", label: "No Role", value: "" },
      ],
    },
  ];
  

export const STUDENT_CREATION_FORM :FacutyForm[]= [
    {
        id: '1',
        name: "name",
        label: "Name",
        placeholder: "Enter student name",
        inputType: "input",
        type: "text",
    },
    {
        id: '2',
        name: "email",
        label: "Email",
        placeholder: "Enter student email",
        inputType: "input",
        type: "email",
    },
    {
        id:'3',
        name: "password",
        label: "Password",
        placeholder: "Enter student password",
        inputType: "input",
        type: "password",
    },
    {
        id: '4',
        name: "gender",
        label: "Gender",
        inputType: "select",
        placeholder:'Male',
        type:'text',
        options: [
            { value: "MALE", label: "Male" , id:'1' },
            { value: "FEMALE", label: "Female" ,id:'2'},
        ],
    },
    {
        id: '5',
        name: "departmentId",
        label: "Department",
        placeholder: "Select Department",
        inputType: "input",
        type: "text",
    },
    {
        id: '6',
        name: "parentName",
        label: "Parent Name",
        placeholder: "Enter parent name",
        inputType: "input",
        type: "text",
    },
    {
        id: '7',
        name: "parentMobile",
        label: "Parent Mobile",
        placeholder: "Enter parent mobile number",
        inputType: "input",
        type: "text",
    },
    {
        id: '8',
        name: "parentEmail",
        label: "Parent Email",
        placeholder: "Enter parent email",
        inputType: "input",
        type: "email",
    },

];

export const DEPARTMENT_CREATION_FORM: FacutyForm[] = [
  {
    id:'1',
    inputType: "input",
    type: "text",
    label: "Department Name",
    placeholder: "Enter department name",
    name: "name",
  },
  {
    id:'2',
    inputType: "textarea",
    type:'text',
    label: "Description",
    placeholder: "Enter department description",
    name: "description",
  },
];


export const CLASS_CREATION_FORM:FacutyForm[] = [
  { 
      id:'1',
      inputType: "input",
      type: "text",
      label: "Class",
      placeholder: "Enter class",
      name: "class",
  },
  {
      id:'2',
      inputType: "input",
      type: "text",
      label: "Branch",
      placeholder: "Enter branch",
      name: "branch",
  },
];



export const ORGANIZATION_CREATION_FORM : FormGeneratorProps[]= [
  { 
      id:'1',
      inputType: "input",
      type: "text",
      label: "Organization Name",
      placeholder: "Enter organization name",
      name: "name",
  },
  {
    id:'2',
      inputType: "select",
      label: "Organization Type",
      placeholder: "Select organization type",
      name: "type",
      options: [
          { value: "Department", label: "Department", id: "Department" },
          { value: "Club", label: "Club", id: "Club" },
          { value: "CollegeEvent", label: "College Event", id: "CollegeEvent" },
          { value: "Mess", label: "Mess", id: "Mess" },
      ],
  },

];



export const FACILITY_CREATION_FORM :FormGeneratorProps[]=  [
  { id:'1', label: 'Name', name:'name',placeholder: 'Enter Facility Name', inputType: 'input', type: 'text' },
  {id:'2', label: 'Description', name:'description', placeholder: 'Enter Facility Description', inputType: 'textarea',  lines: 3 },
  
];


export const FACILITY_SLOT_CREATION_FORM = [
  { id:'1',name: 'date', label: 'Date', placeholder: 'Select Date', inputType: 'input', type: 'date' },
  { id:'2',name: 'startTime', label: 'Start Time', placeholder: 'Select Start Time', inputType: 'input', type: 'time' },
  { id:'3',name: 'endTime', label: 'End Time', placeholder: 'Select End Time', inputType: 'input', type: 'time' },
  { id:'4',name: 'maxCapacity', label: 'Max Capacity', placeholder: 'Enter Max Capacity', inputType: 'input', type: 'number' },
  { id:'5',name: 'reason', label: 'Reason (if any)', placeholder: 'Enter Reason', inputType: 'textarea', lines: 2 },
];



export const COMPLAINT_CREATION_FORM = [
  { name:'description',id: 'description', label: 'Description', placeholder: 'Enter Complaint Description', inputType: 'textarea', lines: 4 },
  { name:'revealIdentity',id: 'revealIdentity', label: 'Reveal Identity?', inputType: 'select', options: [
      { value: 'true', label: 'Yes' ,id:'1' },
      { value: 'false', label: 'No',id:'2' }
    ]
  },
  // File upload will be handled separately
];



export const EXAM_CREATION_FORM = [
  { name:'title',id: 'title', label: 'Title', placeholder: 'Enter Exam Title', inputType: 'input', type: 'text' },
  { name: 'description',id: 'description', label: 'Description', placeholder: 'Enter Exam Description', inputType: 'textarea', lines: 4 },
  { name:'date',id: 'date', label: 'Date', placeholder: 'Select Exam Date', inputType: 'input', type: 'date' },
  // File upload for exam data will be handled separately
];


export const CHEATING_RECORD_CREATION_FORM = [
  { name:'reason',id: 'reason', label: 'Reason', placeholder: 'Enter Reason for Cheating Record', inputType: 'textarea', lines: 4 },

];



export const BUDGET_CREATION_FORM = [
  {name:'title', id: 'title', label: 'Title', placeholder: 'Enter Budget Title', inputType: 'input', type: 'text' },
  { name:'description',id: 'description', label: 'Description', placeholder: 'Enter Budget Description', inputType: 'textarea', lines: 3 },
  { name:'amount',id: 'amount', label: 'Amount', placeholder: 'Enter Budget Amount', inputType: 'input', type: 'number' },
  // Organization selection will be handled separately
];


export const BUDGET_TRANSACTION_CREATION_FORM = [
  { id: 'title', label: 'Title', placeholder: 'Enter Transaction Title', inputType: 'input', type: 'text' },
  { id: 'amount', label: 'Amount', placeholder: 'Enter Transaction Amount', inputType: 'input', type: 'number' },
  { id: 'description', label: 'Description', placeholder: 'Enter Transaction Description', inputType: 'textarea', lines: 3 },
  // Receipt upload will be handled separately
];


export const ELECTIONS_LIST_CREATION_FORM = [
  { name:'name',id: 'name', label: 'Election List Name', placeholder: 'Enter Election List Name', inputType: 'input', type: 'text' },
];



export const ELECTION_CREATION_FORM = [
  { name:'title',id: 'title', label: 'Election Title', placeholder: 'Enter Election Title', inputType: 'input', type: 'text' },
  {name:'description', id: 'description', label: 'Description', placeholder: 'Enter Election Description', inputType: 'textarea', lines: 3 },
  {name:'status', id: 'status', label: 'Status', inputType: 'select', options: [
      { value: 'HIDDEN', label: 'Hidden' },
      { value: 'ACTIVE', label: 'Active' },
      { value: 'COMPLETED', label: 'Completed' }
    ]
  },
  { name:'starttime',id: 'startTime', label: 'Start Time', placeholder: 'Select Start Time', inputType: 'input', type: 'datetime-local' },
  { name:'endtime',id: 'endTime', label: 'End Time', placeholder: 'Select End Time', inputType: 'input', type: 'datetime-local' },
];



export const CANDIDATE_CREATION_FORM:FormGeneratorProps[] = [
  { name:'postion',id: '1', label: 'Position', placeholder: 'Enter Position', inputType: 'input', type: 'text' },
  { name:'manifesto',id: '2', label: 'Manifesto', placeholder: 'Enter Manifesto', inputType: 'textarea', lines: 3 },
  { name:'description',id: '3', label: 'Description', placeholder: 'Enter Description', inputType: 'textarea', lines: 3 },
];

export const FACILITY_REVIEW_CREATION_FORM = [
  { name:'rating',id: 'rating', label: 'Rating', placeholder: 'Enter Rating (1-5)', inputType: 'input', type: 'number' },
  { name:'comment',id: 'comment', label: 'Comment', placeholder: 'Enter Comment', inputType: 'textarea', lines: 3 },
  { name:'description',id: 'description', label: 'Description', placeholder: 'Enter Description', inputType: 'textarea', lines: 3 },
];