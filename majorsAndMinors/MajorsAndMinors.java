package majorsAndMinors;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Scanner;

public class MajorsAndMinors {
    public static void main(String[] args) throws Exception {

        Scanner sc = new Scanner(new File("majorsAndMinors/majmin.txt"));
        ArrayList<MajMin> allMajorsAndMinors = new ArrayList<MajMin>();

        while (sc.hasNextLine()) {

            //name
            String line = sc.nextLine();
            String name = line;

            //major / minor
            line = sc.nextLine();
            boolean major = line.contains("Major");
            boolean minor = line.contains("Minor");

            //program code
            line = sc.nextLine();
            String code = line.substring(14);

            //department
            line = sc.nextLine();

            //school
            line = sc.nextLine();
            String school = line.substring(8);

            //putting it together
            allMajorsAndMinors.add(new MajMin(name, major, minor, code, school));

        }
        
        //make output file
        try {
            File output = new File("majorsAndMinors/allMajorsAndMinors.json");
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
        PrintWriter out = new PrintWriter("majorsAndMinors/allMajorsAndMinors.json");
        out.println("[");

        //now we can print
        for (MajMin x : allMajorsAndMinors) {
            out.println("  {");
            
            //major/minor name
            out.print("    \"name\": \"");
            out.print(x.getName());
            out.println("\",");

            //is major and/or minor
            out.print("    \"programType\": \"");
            if (x.isMajor() && x.isMinor()) {
                out.print("Major, Minor");
            } else if (x.isMajor()) {
                out.print("Major");
            } else if (x.isMinor()) {
                out.print("Minor");
            }
            out.println("\","); 

            //program code
            out.print("    \"programCode\": \"");
            out.print(x.getProgramCode());
            out.println("\",");

            //school
            out.print("    \"school\": \"");
            out.print(x.getSchool());
            out.println("\"");

            out.println("  },"); //delete very last comma
        }

        out.print("]");
        out.close();
        
        sc.close();
    }
}
