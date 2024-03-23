package courses;

import java.io.FileNotFoundException;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Scanner;

public class ParseAllCourses {
    public static void main(String[] args) throws Exception {

        //contins all courses
        HashMap<String, Course> allCourses = new HashMap<String, Course>();

        //parse through all existing files and add them to a hashmap - no duplicates
        File dir = new File("courses/txtFiles");
        File[] directoryListing = dir.listFiles();
        for (File txtFile : directoryListing) {
            parser(txtFile, allCourses);
        }


        
        //make output file
        try {
            File output = new File("courses/allCourses.json");
            if (output.createNewFile()) {
                System.out.println("File created: " + output.getName());
            } else {
                System.out.println("File already exists.");
            }
        } catch (IOException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }

        //go through hashmap and write out all the courses
        PrintWriter out = new PrintWriter("courses/allCourses.json");
        out.println("[");
        
        //we want to print out the courses in order
        String[] courseNumbers = new String[allCourses.size()];
        int counter = 0;
        for (String courseNum : allCourses.keySet()) {
            courseNumbers[counter++] = courseNum;
        }
        Arrays.sort(courseNumbers);

        //now we can print
        for (String courseNum : courseNumbers) {
            out.println("  {");
            
            //course number
            out.print("    \"courseString\": \"");
            out.print(courseNum);
            out.println("\",");

            //course name
            out.print("    \"title\": \"");
            out.print(allCourses.get(courseNum).getCourseName());
            out.println("\","); 

            //core codes
            out.print("    \"coreCodes\": [");
            if (allCourses.get(courseNum).getCoreCodes() == null) {
                out.println("],");
            } else {
                for (String core : allCourses.get(courseNum).getCoreCodes()) {
                    out.print("\n      \"");
                    out.print(core);
                    out.print("\","); //ctrl+f replace ",\n    \]" with "\n    ]"
                }
                out.println("\n    ],");
            }

            //credits
            out.print("    \"credits\": ");
            out.print((allCourses.get(courseNum).getCredits() > 0) ? allCourses.get(courseNum).getCredits() : "null");
            out.println(",");

            //prereqs
            out.print("    \"prereqs\": \"");
            if (allCourses.get(courseNum).getPrereqs() == null) {
                out.println("\",");
            } else {
                for (ArrayList<ArrayList<String>> layer1 : allCourses.get(courseNum).getPrereqs()) {
                    for (ArrayList<String> layer2 : layer1) {
                        for (String prNumber : layer2) {
                            out.print(prNumber);
                            out.print(" or ");
                        }
                        out.print("AND "); //ctrl+f: replace "or AND" with "AND"
                    }
                    out.print("OR "); //ctrl+f: replace "AND OR" with "OR"
                }
                out.println("\","); //ctrl+f: replace "OR \"" with "\""
            }

            //semester(s) offered
            out.print("    \"semesters\": \"");
            if (allCourses.get(courseNum).getSemsOffered()[0] && allCourses.get(courseNum).getSemsOffered()[1]) {
                out.println("Fall and Spring\"");
            } else if (allCourses.get(courseNum).getSemsOffered()[0]) {
                out.println("Fall\"");
            } else if (allCourses.get(courseNum).getSemsOffered()[1]) {
                out.println("Spring\"");
            }

            out.println("  },"); //delete very last comma
        }

        out.print("]");
        out.close();

    }

    private static void parser(File filename, HashMap<String, Course> allCourses) throws FileNotFoundException {

        Scanner sc = new Scanner(filename);
        boolean fall = filename.getName().contains("(F");
        boolean spring = filename.getName().contains("(S");

        //each iteration adds one course to the hashmap
        while (true) {
            String line = sc.nextLine();
            if (line.equals("[") || line.equals("  {") || line.equals("  },") || line.equals("  }")) continue;
            if (line.equals("]")) break;

            //course number
            String[] lineSplit = line.split("\"");
            String courseNumber = lineSplit[3];

            //course name
            line = sc.nextLine();
            lineSplit = line.split("\"");
            String courseName = lineSplit[3];

            //core codes
            line = sc.nextLine();
            lineSplit = line.split(": ");
            ArrayList<String> cores = null;
            if (!lineSplit[1].equals("[],")) {
                cores = new ArrayList<String>();
                line = sc.nextLine();
                do {
                    lineSplit = line.split("\"");
                    cores.add(lineSplit[1]);
                    line = sc.nextLine();
                } while (!line.equals("    ],"));
            }

            //credits
            line = sc.nextLine();
            lineSplit = line.split(": ");
            String credsString = lineSplit[1].substring(0, lineSplit[1].length() - 1);
            double creds = (credsString.equals("null")) ? -1.0 : Double.parseDouble(credsString);

            //prereqs
            line = sc.nextLine();
            lineSplit = line.split("\"");
            ArrayList<ArrayList<ArrayList<String>>> prs = null;
            if (lineSplit.length == 4) {
                String[] bigORs = lineSplit[3].split("<em> OR </em>");
                prs = new ArrayList<ArrayList<ArrayList<String>>>();
                for (String oneOption : bigORs) {
                    String[] ands = oneOption.split("<em> AND </em>");
                    ArrayList<ArrayList<String>> thisOptionNeeds = new ArrayList<ArrayList<String>>();
                    for (String oneNeed : ands) {
                        String[] smallors = oneNeed.split("<em> or </em>");
                        ArrayList<String> bruh = new ArrayList<String>();
                        for (String annoying : smallors) {
                            bruh.add(annoying.substring(1, 11));
                        }
                        thisOptionNeeds.add(bruh);
                    }
                    prs.add(thisOptionNeeds);
                }
            }

            //semester offered
            boolean[] sems = new boolean[2];
            if (allCourses.containsKey(courseNumber)) sems = allCourses.get(courseNumber).getSemsOffered();
            if (fall) {
                sems[0] = true;
            } else if (spring) {
                sems[1] = true;
            }

            Course oneCourse = new Course(courseName, cores, creds, prs, sems);
            allCourses.put(courseNumber, oneCourse);

        }
        sc.close();

    }
}
