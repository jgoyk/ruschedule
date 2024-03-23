package courses;

import java.util.HashMap;
import java.util.Scanner;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.io.IOException;

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
            File output = new File("allCourses.txt");
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
        PrintWriter out = new PrintWriter("allCourses.txt");
        out.println("foo");
        out.close();

    }

    private static void parser(File filename, HashMap<String, Course> allCourses) throws FileNotFoundException {

        Scanner sc = new Scanner(filename);
        while (sc.hasNextLine()) {
            String line = sc.nextLine();

        }
        sc.close();

    }

}
