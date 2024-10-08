package courses;

import java.util.ArrayList;

public class Course {

    //private String courseNumber; //"01:198:211"
    private String courseName; //"Computer Architecture"
    private ArrayList<String> coreCodes; //[]
    private double credits; //4.0
    private ArrayList<ArrayList<ArrayList<String>>> prereqs; //[ ["01:198:112], [14:332:351"] ]
    private boolean semsOffered[]; //[f, s]

    public Course() {
        courseName = "";
        coreCodes = new ArrayList<String>();
        credits = 0;
        prereqs = new ArrayList<ArrayList<ArrayList<String>>>();
        semsOffered = new boolean[2];
    }

    public Course(String name, ArrayList<String> cores, double c, ArrayList<ArrayList<ArrayList<String>>> prs, boolean[] sems) {
        courseName = name;
        coreCodes = cores;
        credits = c;
        prereqs = prs;
        semsOffered = sems;
    }

    //setters
    public void setCourseName(String name) {courseName = name;}
    public void setCoreCodes(ArrayList<String> cores) {coreCodes = cores;}
    public void setCredits(double c) {credits = c;}
    public void setPrereqs(ArrayList<ArrayList<ArrayList<String>>> prs) {prereqs = prs;}
    public void setSemsOffered(boolean[] sems) {semsOffered = sems;}

    //getters
    public String getCourseName() {return courseName;}
    public ArrayList<String> getCoreCodes() {return coreCodes;}
    public double getCredits() {return credits;}
    public ArrayList<ArrayList<ArrayList<String>>> getPrereqs() {return prereqs;}
    public boolean[] getSemsOffered() {return semsOffered;}
    
}
