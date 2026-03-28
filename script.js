const degreeSelect = document.getElementById("degree");
const subjectSelect = document.getElementById("subject");
const orderForm = document.getElementById("orderForm");

const allSubjects = [
  "Accounting",
  "Actuarial Science",
  "Aerospace Engineering",
  "Agriculture",
  "Anatomy & Physiology",
  "Anthropology",
  "Architecture",
  "Art & Design",
  "Artificial Intelligence",
  "Biochemistry",
  "Biomedical Science",
  "Biotechnology",
  "Building Surveying",
  "Business Analytics",
  "Business Management",
  "Chemical Engineering",
  "Chemistry",
  "Civil Engineering",
  "Classics",
  "Clinical Psychology",
  "Computer Science",
  "Criminology",
  "Cyber Security",
  "Data Science",
  "Dentistry",
  "Development Studies",
  "Digital Marketing",
  "Drama & Theatre",
  "Economics",
  "Education",
  "Electrical & Electronic Engineering",
  "English Language",
  "English Literature",
  "Environmental Management",
  "Environmental Science",
  "Fashion",
  "Film & Media Studies",
  "Finance",
  "Forensic Science",
  "Geography",
  "Graphic Design",
  "Health & Social Care",
  "History",
  "Hospitality & Tourism",
  "Human Resource Management",
  "Information Technology",
  "International Business",
  "International Relations",
  "Journalism",
  "Law",
  "Linguistics",
  "Logistics & Supply Chain",
  "Management Consultancy",
  "Marketing",
  "Mathematics",
  "Mechanical Engineering",
  "Medicine",
  "Microbiology",
  "Midwifery",
  "Music",
  "Nursing",
  "Nutrition",
  "Occupational Therapy",
  "Pharmacy",
  "Philosophy",
  "Physics",
  "Physiotherapy",
  "Politics",
  "Project Management",
  "Psychology",
  "Public Health",
  "Public Policy",
  "Quantity Surveying",
  "Radiography",
  "Real Estate",
  "Renewable Energy",
  "Robotics",
  "Sociology",
  "Software Engineering",
  "Sports Science",
  "Statistics",
  "Teacher Training",
  "Theology",
  "Urban Planning",
  "Veterinary Science",
  "Zoology",
];

const gcseSubjects = [
  "English Language",
  "English Literature",
  "Mathematics",
  "Biology",
  "Chemistry",
  "Physics",
  "Combined Science",
  "History",
  "Geography",
  "Computer Science",
  "Design & Technology",
  "Art & Design",
  "Religious Studies",
  "Business Studies",
  "Drama",
  "Music",
  "French",
  "Spanish",
  "German",
  "Physical Education",
];

const aLevelSubjects = [
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Further Mathematics",
  "Economics",
  "Business Studies",
  "Psychology",
  "Sociology",
  "History",
  "Geography",
  "English Literature",
  "English Language",
  "Computer Science",
  "Politics",
  "Law",
  "Art & Design",
  "Media Studies",
  "French",
  "Spanish",
];

const degreeSubjects = {
  GCSE: gcseSubjects,
  "International GCSE": gcseSubjects,
  "A-Level / AS": aLevelSubjects,
  "International Baccalaureate (IB)": aLevelSubjects,
  "BTEC Level 3 / Extended Diploma": aLevelSubjects,
  "T-Level": aLevelSubjects,
  "Scottish Highers / Advanced Highers": aLevelSubjects,
  "Access to HE Diploma": allSubjects,
  "Foundation Year": allSubjects,
  CertHE: allSubjects,
  DipHE: allSubjects,
  "HNC / HND": allSubjects,
  "Bachelor's (BA/BSc/BEng/LLB)": allSubjects,
  "Integrated Master's (MEng/MChem/MPhys)": allSubjects,
  "Graduate Diploma": allSubjects,
  "Postgraduate Certificate (PGCert)": allSubjects,
  "Postgraduate Diploma (PGDip)": allSubjects,
  "Master's (MA/MSc/MBA/LLM)": allSubjects,
  "MRes / MPhil": allSubjects,
  "Doctorate (PhD/DBA/EdD)": allSubjects,
  "Professional / CPD": allSubjects,
};

const rateCards = {
  assignment: { technical: 80, "non-technical": 50, baseWords: 3000 },
  "case-study": { technical: 90, "non-technical": 60, baseWords: 3000 },
  presentation: { technical: 70, "non-technical": 45, baseWords: 2000 },
  dissertation: { technical: 500, "non-technical": 350, baseWords: 15000 },
  editing: { technical: 40, "non-technical": 30, baseWords: 3000 },
};

const turnaroundMultiplier = {
  standard: 1,
  express: 1.2,
  rush: 1.5,
};

const addonRates = {
  data: 30,
  slides: 20,
  plagiarism: 10,
};

const summaryFields = {
  degree: document.getElementById("summaryDegree"),
  subject: document.getElementById("summarySubject"),
  assignment: document.getElementById("summaryAssignment"),
  category: document.getElementById("summaryCategory"),
  words: document.getElementById("summaryWords"),
  turnaround: document.getElementById("summaryTurnaround"),
  addons: document.getElementById("summaryAddons"),
  total: document.getElementById("summaryTotal"),
};

const currencyFormat = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const formatNumber = (value) => value.toLocaleString("en-GB");

const populateSubjects = () => {
  const selectedDegree = degreeSelect.value;
  const subjects = degreeSubjects[selectedDegree] || [];

  subjectSelect.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select subject";
  subjectSelect.appendChild(defaultOption);

  subjects.forEach((subject) => {
    const option = document.createElement("option");
    option.value = subject;
    option.textContent = subject;
    subjectSelect.appendChild(option);
  });
};

const getAddonSelections = () =>
  Array.from(orderForm.querySelectorAll("input[name=addons]:checked")).map(
    (input) => input.value
  );

const calculateTotal = () => {
  const assignmentType = orderForm.assignmentType.value;
  const category = orderForm.technical.value;
  const wordCount = Number(orderForm.wordCount.value) || 0;
  const turnaround = orderForm.turnaround.value;

  const baseRate = rateCards[assignmentType] || rateCards.assignment;
  const baseWords = baseRate.baseWords;
  const basePrice = baseRate[category];

  const scaledPrice = (wordCount / baseWords) * basePrice;
  const adjustedPrice = scaledPrice * turnaroundMultiplier[turnaround];
  const addonSelections = getAddonSelections();
  const addonTotal = addonSelections.reduce((sum, key) => sum + addonRates[key], 0);

  return {
    total: Math.max(adjustedPrice + addonTotal, 0),
    addonSelections,
  };
};

const updateSummary = () => {
  const assignmentType = orderForm.assignmentType.selectedOptions[0].textContent;
  const categoryLabel =
    orderForm.technical.value === "technical" ? "Technical" : "Non-technical";
  const wordCount = Number(orderForm.wordCount.value) || 0;
  const turnaroundLabel = orderForm.turnaround.selectedOptions[0].textContent;

  const { total, addonSelections } = calculateTotal();

  summaryFields.degree.textContent = degreeSelect.value || "-";
  summaryFields.subject.textContent = subjectSelect.value || "-";
  summaryFields.assignment.textContent = assignmentType;
  summaryFields.category.textContent = categoryLabel;
  summaryFields.words.textContent = formatNumber(wordCount || 0);
  summaryFields.turnaround.textContent = turnaroundLabel;
  summaryFields.addons.textContent =
    addonSelections.length === 0
      ? "None"
      : addonSelections
          .map((key) =>
            key === "data"
              ? "Data analysis"
              : key === "slides"
              ? "Presentation slides"
              : "Plagiarism report"
          )
          .join(", ");
  summaryFields.total.textContent = currencyFormat.format(total);
};

if (degreeSelect) {
  degreeSelect.addEventListener("change", () => {
    populateSubjects();
    updateSummary();
  });
}

if (orderForm) {
  orderForm.addEventListener("input", updateSummary);
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateSummary();
    window.alert(
      "Thank you! Your order request has been received. A project manager will confirm the final quote shortly."
    );
    orderForm.reset();
    populateSubjects();
    updateSummary();
  });
}

populateSubjects();
updateSummary();
