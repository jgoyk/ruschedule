package majorsAndMinors;

public class MajMin {
    
    private String majMinName;
    private int programType;
    private String programCode;
    private String school;

    public MajMin(String name, int type, String code, String s) {
        majMinName = name;
        programType = type;
        programCode = code;
        school = s;
    }

    public String getName() {return majMinName;}
    public int getProgramType() {return programType;}
    public String getProgramCode() {return programCode;}
    public String getSchool() {return school;}

}
