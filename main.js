/**
 * Generates a list of employees based on input parameters.
 *
 * @param {Object} dtoIn - Input data.
 * @param {number} dtoIn.employeeCount - Number of employees to generate.
 * @param {Object} dtoIn.ageRange - Age range of employees.
 * @param {number} dtoIn.ageRange.min - Minimum age.
 * @param {number} dtoIn.ageRange.max - Maximum age.
 * @returns {Object} dtoOut - Output data.
 * @returns {Array} dtoOut.employees - List of generated employees.
 */
function main(dtoIn) {
  // --- Input validation ---
  if (!dtoIn || typeof dtoIn !== "object") {
    throw new Error("dtoIn must be an object.");
  }

  const employeeCount = dtoIn.employeeCount;
  const minAge = dtoIn?.ageRange?.min;
  const maxAge = dtoIn?.ageRange?.max;

  if (
    typeof employeeCount !== "number" ||
    !Number.isInteger(employeeCount) ||
    employeeCount <= 0
  ) {
    throw new Error("employeeCount must be a positive integer.");
  }

  if (
    typeof minAge !== "number" ||
    typeof maxAge !== "number" ||
    !Number.isInteger(minAge) ||
    !Number.isInteger(maxAge) ||
    minAge < 0 ||
    maxAge < 0 ||
    minAge > maxAge
  ) {
    throw new Error(
      "ageRange.min and ageRange.max must be valid integers and min <= max."
    );
  }

  // --- Data sources ---
  const maleNames = ["Peter", "John", "Martin", "Thomas", "Michael", "James", "Robert", "William"];
  const femaleNames = ["Emma", "Olivia", "Sophia", "Ava", "Isabella", "Mia", "Emily", "Amelia"];
  const surnames = ["Smith", "Johnson", "Brown", "Taylor", "Anderson", "Thomas", "Jackson", "White"];
  const workloads = [10, 20, 30, 40];
  const genders = ["male", "female"];

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomElement(array) {
    return array[randomInt(0, array.length - 1)];
  }

  function randomBirthdate(minAgeYears, maxAgeYears) {
    const today = new Date();

    const maxDate = new Date(
      today.getFullYear() - minAgeYears,
      today.getMonth(),
      today.getDate()
    );

    const minDate = new Date(
      today.getFullYear() - maxAgeYears,
      today.getMonth(),
      today.getDate()
    );

    const randomTime = randomInt(minDate.getTime(), maxDate.getTime());
    const date = new Date(randomTime);

    return date.toISOString().slice(0, 10);
  }

  // --- Generate employees ---
  const employees = [];

  for (let i = 0; i < employeeCount; i++) {
    const gender = randomElement(genders);
    const name =
      gender === "male"
        ? randomElement(maleNames)
        : randomElement(femaleNames);

    const surname = randomElement(surnames);
    const birthdate = randomBirthdate(minAge, maxAge);
    const workload = randomElement(workloads);

    const employee = {
      name,
      surname,
      gender,
      birthdate,
      workload
    };

    employees.push(employee);
  }

  const dtoOut = { employees };
  return dtoOut;
}



// ✅ ES MODULE EXPORT
export default main;
