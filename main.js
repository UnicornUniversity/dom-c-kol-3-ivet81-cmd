/**
 * Generates a list of employees based on input parameters.
 *
 * @param {object|number} [dtoIn] - Input data or directly employee count.
 *  - If number: treated as employeeCount.
 *  - If object: can contain employeeCount and ageRange.
 * @returns {Array<object>} List of generated employees.
 */
function main(dtoIn) {
  // --- Normalize input & determine employeeCount ---

  const safeDtoIn = dtoIn ?? null;
  let employeeCount = 0;

  // If dtoIn is a number, treat it directly as employeeCount
  if (typeof safeDtoIn === "number") {
    if (Number.isInteger(safeDtoIn) && safeDtoIn >= 0) {
      employeeCount = safeDtoIn;
    }
  } else if (typeof safeDtoIn === "object" && safeDtoIn !== null) {
    const candidate =
      safeDtoIn.employeeCount ?? safeDtoIn.personCount ?? safeDtoIn.count;
    if (Number.isInteger(candidate) && candidate >= 0) {
      employeeCount = candidate;
    }
  }

  // --- Age range handling ---

  let minAge = 18;
  let maxAge = 65;

  if (
    typeof safeDtoIn === "object" &&
    safeDtoIn !== null &&
    safeDtoIn.ageRange
  ) {
    const { min, max } = safeDtoIn.ageRange;

    if (Number.isInteger(min) && min >= 0) {
      minAge = min;
    }
    if (Number.isInteger(max) && max >= minAge) {
      maxAge = max;
    }
    if (maxAge < minAge) {
      maxAge = minAge;
    }
  }

  // --- Data sources for random generation ---

  const maleNames = [
    "Peter",
    "John",
    "Martin",
    "Thomas",
    "Michael",
    "James",
    "Robert",
    "William"
  ];
  const femaleNames = [
    "Emma",
    "Olivia",
    "Sophia",
    "Ava",
    "Isabella",
    "Mia",
    "Emily",
    "Amelia"
  ];
  const surnames = [
    "Smith",
    "Johnson",
    "Brown",
    "Taylor",
    "Anderson",
    "Thomas",
    "Jackson",
    "White"
  ];
  const workloads = [10, 20, 30, 40];
  const genders = ["male", "female"];

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomElement(array) {
    return array[randomInt(0, array.length - 1)];
  }

  /**
   * Generates a random date in format "YYYY-MM-DD" (exactly 10 chars),
   * where age is between minAgeYears and maxAgeYears (inclusive).
   *
   * @param {number} minAgeYears
   * @param {number} maxAgeYears
   * @returns {string} "YYYY-MM-DD"
   */
  function randomBirthdate10(minAgeYears, maxAgeYears) {
  const today = new Date();
  const currentYear = today.getFullYear();

  const minYear = currentYear - maxAgeYears; // najstarší
  const maxYear = currentYear - minAgeYears; // najmladší

  const year = randomInt(minYear, maxYear);
  const month = randomInt(1, 12);

  const daysInMonth = new Date(year, month, 0).getDate();
  const day = randomInt(1, daysInMonth);

  const m = String(month).padStart(2, "0"); // 01–12
  const d = String(day).padStart(2, "0");   // 01–31

  // presne 10 znakov
  return `${year}-${m}-${d}`;
}


  // --- Generate employees ---

  const employees = [];

  for (let i = 0; i < employeeCount; i++) {
    const gender = randomElement(genders);
    const name =
      gender === "male" ? randomElement(maleNames) : randomElement(femaleNames);

    const surname = randomElement(surnames);
    const birthdate = randomBirthdate10(minAge, maxAge); // UŽ JE TO 10-CHAR STRING

    const workload = randomElement(workloads);

    employees.push({
      name,
      surname,
      gender,
      birthdate,
      workload
    });
  }

  return employees;
}

export default main;
export { main };
