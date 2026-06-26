const educationConfig = {
  Nigeria: {
    levels: ["Secondary School", "Entrance Exams", "Tertiary"],
    subLevels: {
      "Secondary School": ["JSS1", "JSS2", "JSS3", "SSS1", "SSS2", "SSS3"],
      "Entrance Exams": ["WAEC", "NECO", "JAMB", "NABTEB"],
      "Tertiary": ["University", "Polytechnic", "College of Education", "Monotechnic"],
    },
    subjects: ["Mathematics", "English Language", "Biology", "Chemistry", "Physics", "Economics", "Government", "Geography", "Literature in English", "ICT/Computer Studies", "History", "Civic Education", "Agricultural Science", "Further Mathematics", "Technical Drawing", "French", "Yoruba", "Igbo", "Hausa", "Commerce", "Accounting", "Marketing", "Home Economics", "Music", "Fine Arts", "Physical Education"],
  },
  UK: {
    levels: ["Secondary School", "Sixth Form", "University"],
    subLevels: {
      "Secondary School": ["Year 7", "Year 8", "Year 9", "Year 10 (GCSE)", "Year 11 (GCSE)"],
      "Sixth Form": ["Year 12 (AS-Level)", "Year 13 (A-Level)"],
      "University": ["Undergraduate", "Postgraduate"],
    },
    subjects: ["Mathematics", "English Literature", "English Language", "Biology", "Chemistry", "Physics", "History", "Geography", "Economics", "Computer Science", "Psychology", "Sociology", "Business Studies", "French", "Spanish", "German", "Art & Design", "Music", "Physical Education", "Religious Studies", "Media Studies", "Drama", "Design & Technology", "Further Mathematics"],
  },
  USA: {
    levels: ["Middle School", "High School", "College"],
    subLevels: {
      "Middle School": ["Grade 6", "Grade 7", "Grade 8"],
      "High School": ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
      "College": ["Undergraduate", "Postgraduate"],
    },
    subjects: ["Mathematics", "Algebra", "Geometry", "Calculus", "English", "Biology", "Chemistry", "Physics", "US History", "World History", "Government/Civics", "Economics", "Computer Science", "Psychology", "Sociology", "Spanish", "French", "Art", "Music", "Physical Education", "Environmental Science", "AP Physics", "AP Chemistry", "AP Biology", "SAT Math", "SAT Reading & Writing", "ACT Prep"],
  },
  India: {
    levels: ["Secondary School", "Higher Secondary", "University"],
    subLevels: {
      "Secondary School": ["Class 9 (CBSE)", "Class 10 (CBSE)", "Class 9 (ICSE)", "Class 10 (ICSE)"],
      "Higher Secondary": ["Class 11", "Class 12"],
      "University": ["Undergraduate", "Postgraduate"],
    },
    subjects: ["Mathematics", "English", "Hindi", "Biology", "Chemistry", "Physics", "History", "Geography", "Economics", "Computer Science", "Accountancy", "Business Studies", "Political Science", "Sociology", "Psychology", "Physical Education", "Sanskrit", "Environmental Science", "JEE Prep", "NEET Prep", "CBSE Board Prep"],
  },
  Ghana: {
    levels: ["Secondary School", "Entrance Exams", "Tertiary"],
    subLevels: {
      "Secondary School": ["JHS 1", "JHS 2", "JHS 3", "SHS 1", "SHS 2", "SHS 3"],
      "Entrance Exams": ["WASSCE", "BECE"],
      "Tertiary": ["University", "Polytechnic", "College"],
    },
    subjects: ["Mathematics", "English Language", "Integrated Science", "Social Studies", "Biology", "Chemistry", "Physics", "Economics", "Geography", "History", "Government", "ICT", "Accounting", "Business Management", "French"],
  },
  Kenya: {
    levels: ["Secondary School", "Entrance Exams", "University"],
    subLevels: {
      "Secondary School": ["Form 1", "Form 2", "Form 3", "Form 4"],
      "Entrance Exams": ["KCSE", "KCPE"],
      "University": ["Undergraduate", "Postgraduate"],
    },
    subjects: ["Mathematics", "English", "Kiswahili", "Biology", "Chemistry", "Physics", "History & Government", "Geography", "Economics", "Business Studies", "Computer Studies", "Agriculture", "French", "Art & Design", "Music", "Physical Education"],
  },
  "South Africa": {
    levels: ["Secondary School", "Entrance Exams", "University"],
    subLevels: {
      "Secondary School": ["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"],
      "Entrance Exams": ["Matric/NSC"],
      "University": ["Undergraduate", "Postgraduate"],
    },
    subjects: ["Mathematics", "Mathematical Literacy", "English Home Language", "Afrikaans", "Life Sciences", "Physical Sciences", "History", "Geography", "Economics", "Business Studies", "Accounting", "Computer Applications Technology", "Life Orientation", "Visual Arts", "Music"],
  },
  Canada: {
    levels: ["Middle School", "High School", "University"],
    subLevels: {
      "Middle School": ["Grade 6", "Grade 7", "Grade 8"],
      "High School": ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
      "University": ["Undergraduate", "Postgraduate"],
    },
    subjects: ["Mathematics", "English", "French", "Biology", "Chemistry", "Physics", "History", "Geography", "Economics", "Computer Science", "Psychology", "Sociology", "Physical Education", "Art", "Music", "Environmental Science"],
  },
  Australia: {
    levels: ["Secondary School", "Senior Secondary", "University"],
    subLevels: {
      "Secondary School": ["Year 7", "Year 8", "Year 9", "Year 10"],
      "Senior Secondary": ["Year 11", "Year 12 (HSC/VCE/ATAR)"],
      "University": ["Undergraduate", "Postgraduate"],
    },
    subjects: ["Mathematics", "English", "Biology", "Chemistry", "Physics", "History", "Geography", "Economics", "Business Studies", "Computer Science", "Psychology", "Legal Studies", "Music", "Visual Arts", "Physical Education", "Environmental Science"],
  },
  Pakistan: {
    levels: ["Secondary School", "Higher Secondary", "University"],
    subLevels: {
      "Secondary School": ["Class 9", "Class 10 (Matric)"],
      "Higher Secondary": ["Class 11 (FSc/FA)", "Class 12 (FSc/FA)"],
      "University": ["Undergraduate", "Postgraduate"],
    },
    subjects: ["Mathematics", "English", "Urdu", "Biology", "Chemistry", "Physics", "Pakistan Studies", "Islamiyat", "Computer Science", "Economics", "Accounting", "Geography", "History"],
  },
  Others: {
    levels: ["Secondary School", "Tertiary Institution"],
    subLevels: {
      "Secondary School": ["Junior Secondary", "Senior Secondary"],
      "Tertiary Institution": ["Undergraduate", "Postgraduate"],
    },
    subjects: ["Mathematics", "English Language", "Biology", "Chemistry", "Physics", "Economics", "History", "Geography", "Computer Science", "Business Studies", "Accounting", "Literature", "French", "Art", "Music", "Physical Education"],
  },
};

export const courseFields = [
  "Science & Laboratory Sciences",
  "Technology & Computing",
  "Engineering",
  "Medical & Health Sciences",
  "Nursing & Pharmacy",
  "Law",
  "Business & Finance",
  "Economics",
  "Arts & Humanities",
  "Social Sciences",
  "Education",
  "Agriculture & Veterinary",
  "Architecture & Built Environment",
  "Mass Communication & Media",
  "Environmental Sciences",
  "Other"
];

export const goals = ["Exams", "Daily Study", "Homework Help"];

export const countries = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "UK",
  "USA", "Canada", "Australia", "India", "Pakistan", "Others"
];

export default educationConfig;
