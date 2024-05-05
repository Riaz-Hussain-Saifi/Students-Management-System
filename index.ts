#! /usr/bin/env node

// Import necessary modules
import inquirer from "inquirer";
import chalk, { Chalk } from "chalk";

// Define class and fee details
const classDetails: { [key: string]: { courses: string[]; fees: number } } = {
  "9th": { courses: ["Science", "Humanities", "Commerce"], fees: 12000 },
  "10th": { courses: ["Science", "Humanities", "Commerce"], fees: 15000 },
  "11th": { courses: ["Pre-Engineering", "Pre-Medical", "Arts"], fees: 18000 },
  "12th": { courses: ["Pre-Engineering", "Pre-Medical", "Arts"], fees: 22000 },
};

// Initialize students and their balances
interface Student {
  name: string;
  rollNumber: number;
  class: string;
  course: string;
  fees: number;
}

// Function to generate a unique roll number
function generateRollNumber(): number {
  return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
}

let students: Student[] = [];

// Display welcome message
console.log(`\n`);
console.log(chalk.yellowBright(`*`.repeat(74)));
console.log(
  chalk.cyanBright(
    "\t Welcome to Dawn Public School Student's Management System"
  )
);
console.log(chalk.yellowBright(`*`.repeat(74)));
console.log(`\n`);

// Main function
async function main() {
  const options = [
    { name: "View Status", value: "viewStatus" },
    { name: "Enroll New Student", value: "enrollStudent" },
    { name: "About Us", value: "aboutUs" },
    { name: "Exit", value: "exit" },
  ];
  const { choice } = await inquirer.prompt([
    {
      name: "choice",
      type: "list",
      message: "Choose an option:",
      choices: options,
    },
  ]);

  switch (choice) {
    case "viewStatus":
      await viewStatus();
      break;
    case "enrollStudent":
      await enrollStudent();
      break;
    case "aboutUs":
      aboutUs();
      main(); // Return to the main menu after displaying "About Us"
      break;
    case "exit":
      console.log(
        chalk.green(
          "\n\t Thank you for using Dawn Public School Student's Management Application. \n"
        )
      );
      process.exit();
      break;
    default:
      console.log(
        chalk.red("\n\t Invalid choice. Please select a valid option. \n")
      );
      main();
      break;
  }
}

// Function to view status
async function viewStatus() {
  const { studentIdentifier } = await inquirer.prompt([
    {
      name: "studentIdentifier",
      type: "input",
      message: "Enter student's name or roll number to view status:",
    },
  ]);

  const student = students.find(
    (n) =>
      n.name === studentIdentifier ||
      n.rollNumber === parseInt(studentIdentifier)
  );

  if (
    student &&
    (student.name === studentIdentifier ||
      student.rollNumber === parseInt(studentIdentifier))
  ) {
    console.log(chalk.yellow(`\n\t Student Name: ${student.name}`));
    console.log(chalk.cyan(`\t Roll Number: ${student.rollNumber}`));
    console.log(chalk.green(`\t Class: ${student.class}`));
    console.log(chalk.blue(`\t Course: ${student.course}`));
    console.log(chalk.bold(`\t paid Fees: ${student.fees}`));
  } else {
    console.log(
      chalk.red(
        `\n\t Student '${chalk.greenBright(studentIdentifier)}' not found.`
      )
    );
  }
  main();
}

// Function to enroll new student
async function enrollStudent() {
  console.log(chalk.blue("\n\t Enroll New Student:"));
  const studentDetails = await inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "Enter student's name:",
    },
    {
      name: "class",
      type: "list",
      message: "Select student's class:",
      choices: Object.keys(classDetails),
    },
  ]);
  const selectedClass = studentDetails.class;
  const { fees } = classDetails[selectedClass];
  console.log(chalk.gray(`\t Fees: ${fees}`));
  const { selectedCourse } = await inquirer.prompt([
    {
      name: "selectedCourse",
      type: "list",
      message: `Select course for ${studentDetails.name}:`,
      choices: classDetails[selectedClass].courses,
    },
  ]);
  const studentRollNumber = generateRollNumber();
  const newStudent: Student = {
    name: studentDetails.name,
    rollNumber: studentRollNumber,
    class: selectedClass,
    course: selectedCourse,
    fees: fees,
  };

  students.push(newStudent);

  // Payment Step
  const { paymentMethod, amountPaid } = await inquirer.prompt([
    {
      name: "paymentMethod",
      type: "list",
      message: `Select the payment method to pay ${chalk.cyanBright(fees)} `,
      choices: ["Cash", "Bank-Transfer", "JazzCash", "Easypaisa"],
    },
    {
      name: "amountPaid",
      type: "input",
      message: "Enter the amount paid:",
      validate: function (value) {
        if (isNaN(Number(value))) {
          return "Please enter a number.";
        }
        return true;
      },
    },
  ]);

  if (parseFloat(amountPaid) >= fees) {
    console.log(
      chalk.green(
        `\n\t Enrollment successful for ${chalk.whiteBright(
          newStudent.name
        )} in ${chalk.yellowBright(
          newStudent.course
        )} of class ${chalk.blueBright(newStudent.class)}.\n`
      )
    );
    main(); // After enrollment, return to the main menu
  } else {
    console.log(chalk.red(`\n\t Payment declined. Enrollment canceled.\n`));
    main(); // After enrollment, return to the main menu
  }
}

// Function to display information about the system
function aboutUs() {
  console.log(
    chalk.magenta(
      "\n\t This is Dawn Public School Student's Management Application"
    )
  );
  console.log(
    chalk.gray(
      "\n\t This system manages students' enrollment, courses and fees."
    )
  );
  console.log(chalk.yellow("\t Developed by Riaz Hussain Saifi"));
  console.log(
    chalk.gray(
      "\n For more information, visit https://github.com/Riaz-Hussain-Saifi \n"
    )
  );
}

// Run the main function
main();
