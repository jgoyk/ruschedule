package majorsAndMinors;

public class MajMin {
    
    private String majMinName;
    private boolean major;
    private boolean minor;
    private String programCode;
    private String school;

    public MajMin(String name, boolean maj, boolean min, String code, String s) {
        majMinName = name;
        major = maj;
        minor = min;
        programCode = code;
        school = s;
    }

    public String getName() {return majMinName;}
    public boolean isMajor() {return major;}
    public boolean isMinor() {return minor;}
    public String getProgramCode() {return programCode;}
    public String getSchool() {return school;}

}
