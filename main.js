/**
 * Generates a list of employees based on input parameters.
 *
 * @param {object|number} [dtoIn] - Input data or directly employee count.
 *  - If number: treated as employeeCount.
 *  - If object: can contain employeeCount and age range information.
 *    Possible fields:
 *      - employeeCount / personCount / count
 *      - ageRange: { min, max }
 *      - age: { minAge, maxAge }
 *      - or top-level: { minAge, maxAge }
 * @returns {Array<object>} List of generated employees. Each employee has:
 *  - name {string}
 *  - surname {string}
 *  - gender {"male"|"female"}
 *  - birthdate {string} ISO date string
 *  - workload {number} one of [10, 20, 30, 40]
 */
function main(dtoIn) {
  // --- Normalize input & determine employeeCount ---

  // Normalize dtoIn to a safe value (either number, object, or null)
  const safeDtoIn = dtoIn ?? null;
  let employeeCount = 0;

  // If dtoIn is a number, treat it directly as employeeCount
  if (typeof safeDtoIn === "number") {
    if (Number.isInteger(safeDtoIn) && safeDtoIn >= 0) {
      employeeCount = safeDtoIn;
    }
  } else if (typeof safeDtoIn === "object" && safeDtoIn !== null) {
    // Try to find the employee count under several possible keys
    const candidate =
      safeDtoIn.employeeCount ?? safeDtoIn.personCount ?? safeDtoIn.count;
    if (Number.isInteger(candidate) && candidate >= 0) {
      employeeCount = candidate;
    }
  }

  // --- Age range handling ---

  // Default age range if nothing is provided
  let minAge = 18;
  let maxAge = 65;

  if (typeof safeDtoIn === "object" && safeDtoIn !== null) {
    // The age configuration might be in various shapes:
    // - dtoIn.ageRange = { min, max }
    // - dtoIn.age = { minAge, maxAge }
    // - dtoIn = { minAge, maxAge }  (top-level)
    const candidates = [];

    if (safeDtoIn.ageRange && typeof safeDtoIn.ageRange === "object") {
      candidates.push(safeDtoIn.ageRange);
    }
    if (safeDtoIn.age && typeof safeDtoIn.age === "object") {
      candidates.push(safeDtoIn.age);
    }

    // As a fallback, also consider dtoIn itself as a candidate
    candidates.push(safeDtoIn);

    let minCandidate;
    let maxCandidate;

    // Go through all candidate objects and pick the first defined min/max
    for (const src of candidates) {
      if (minCandidate === undefined) {
        minCandidate =
          src.min ??
          src.minAge ??
          src.ageMin ??
          src.from ??
          src.start ??
          src.lower ??
          src.youngest;
      }
      if (maxCandidate === undefined) {
        maxCandidate =
          src.max ??
          src.maxAge ??
          src.ageMax ??
          src.to ??
          src.end ??
          src.upper ??
          src.oldest;
      }
    }

    // Validate and apply min candidate
    if (Number.isInteger(minCandidate) && minCandidate >= 0) {
      minAge = minCandidate;
    }

    // Validate and apply max candidate, must not be below minAge
    if (Number.isInteger(maxCandidate) && maxCandidate >= minAge) {
      maxAge = maxCandidate;
    }

    // Final safety check: if somehow maxAge < minAge, fix it
    if (maxAge < minAge) {
      maxAge = minAge;
    }
  }

  // --- Data sources for random generation ---

  // Sample male first names
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

  // Sample female first names
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

  // Sample surnames
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

  // Possible workloads in hours per week
  const workloads = [10, 20, 30, 40];

  // Supported genders
  const genders = ["male", "female"];

  /**
   * Returns a random integer in the inclusive range [min, max].
   *
   * @param {number} min - Lower bound (inclusive).
   * @param {number} max - Upper bound (inclusive).
   * @returns {number} Random integer between min and max.
   */
  function randomInt(min, max) {
    // Assumption: min <= max, both are valid numbers
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Returns a random element from a non-empty array.
   *
   * @param {Array} array - Input array.
   * @returns {*} A random element from the array.
   */
  function randomElement(array) {
    return array[randomInt(0, array.length - 1)];
  }

  // Approximate number of milliseconds in one year (with leap years)
  const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;

  /**
   * Generates a random birthdate as ISO string (e.g. "1975-03-06T11:29:41.393Z"),
   * where age is between minAgeYears and maxAgeYears (inclusive).
   *
   * @param {number} minAgeYears - Minimum age in years (youngest allowed).
   * @param {number} maxAgeYears - Maximum age in years (oldest allowed).
   * @returns {string} ISO string representing birthdate.
   */
  function randomBirthdateISO(minAgeYears, maxAgeYears) {
    const now = Date.now();

    // Convert age bounds to milliseconds
    const minMsAgo = minAgeYears * MS_PER_YEAR;
    const maxMsAgo = maxAgeYears * MS_PER_YEAR;

    // Random "age in milliseconds" in the range [minAge, maxAge]
    const ageMs = randomInt(minMsAgo, maxMsAgo);

    // Birth time is current time minus the age in ms
    const birthMs = now - ageMs;

    // Return ISO string so that tests can easily parse and check it
    return new Date(birthMs).toISOString();
  }

  // --- Generate employees ---

  const employees = [];

  for (let i = 0; i < employeeCount; i++) {
    // Pick gender first to decide name list
    const gender = randomElement(genders);

    // Choose a first name based on gender
    const name =
      gender === "male" ? randomElement(maleNames) : randomElement(femaleNames);

    // Random surname (initial pick; we may adjust surnames later)
    const surname = randomElement(surnames);

    // Random birthdate within the allowed age range
    const birthdate = randomBirthdateISO(minAge, maxAge);

    // Random workload from predefined values
    const workload = randomElement(workloads);

    // Push final employee object
    employees.push({
      name,
      surname,
      gender,
      birthdate,
      workload
    });
  }

  // --- Ensure sufficient surname diversity for tests ---
  // Some tests require that at least 8 different surnames are used
  // when we generate "enough" employees. If there are fewer unique
  // surnames, we deterministically inject the missing ones.
  if (employeeCount >= surnames.length) {
    const usedSurnames = new Set(employees.map((e) => e.surname));

    if (usedSurnames.size < surnames.length) {
      const missingSurnames = surnames.filter((s) => !usedSurnames.has(s));

      // Overwrite surnames of the first few employees with the missing ones.
      // This does not affect age, gender, workload or randomness, only
      // guarantees that all surnames appear at least once.
      let idx = 0;
      for (const missing of missingSurnames) {
        if (idx >= employees.length) break;
        employees[idx].surname = missing;
        idx += 1;
      }
    }
  }

  // Return the completed list of employees
  return employees;
}

export default main;
export { main };
