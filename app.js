require('dotenv').config();
const CHABI = process.env.CHABI
const express = require("express");
const app = express();
const path = require("path");
const userModel = require("./models/user");
const cookie = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());

function isLoggedIn(req, res, next) {
    if (!req.cookies || !req.cookies.token) {
        return res.render("login");
    }

    try {
        let data = jwt.verify(req.cookies.token, CHABI);
        req.user = data;
        next();
    } catch (err) {
        return res.send("Invalid Token or Session Expired");
    }
}

// 1. Home / Learning Page ka GET Route
app.get("/learning_home", (req, res) => {
    res.render("learning_home", {
        title: "Learning Home",
        description: "Explore interactive chemistry learning tools"
    });
});


app.get("/", function (req, res) {
    res.render("policy")
})

app.get("/home", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});

// 2. Fixed Login POST Route
app.post("/login", async (req, res) => {
    try {
        let { username, password } = req.body;

        let user = await userModel.findOne({ username: username });

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                error: "Username not found. Please register first." 
            });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, error: "Server error" });
            }

            if (result) {
                let token = jwt.sign(
                    { email: user.email, userid: user._id },
                    CHABI
                );
                res.cookie("token", token);
                return res.status(200).json({ success: true, redirect: "/home" });
            } else {
                return res.status(401).json({ 
                    success: false, 
                    error: "Incorrect password. Try again." 
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});

app.post("/register", async (req, res) => {
    try {
        let { password, username, name } = req.body;

        // Check if username already exists
        let existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ 
                success: false, 
                error: "Username is already taken. Please choose another." 
            });
        }

        // Hash password
        bcrypt.genSalt(10, async (err, salt) => {
            if (err) {
                return res.status(500).json({ success: false, error: "Server error" });
            }
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    return res.status(500).json({ success: false, error: "Server error" });
                }

                try {
                    let newUser = await userModel.create({
                        username,
                        name,
                        password: hash,
                    });
                    let token = jwt.sign(
                        { username: newUser.username, userid: newUser._id },
                        CHABI     // shhh ki jagah CHABI use karein
                    );
                    res.cookie("token", token);
                    return res.status(201).json({ success: true, redirect: "/home" });
                } catch (dbError) {
                    if (dbError.code === 11000) {
                        return res.status(409).json({ success: false, error: "Username already taken." });
                    }
                    return res.status(500).json({ success: false, error: "Something went wrong" });
                }
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});

app.get("/create-user", function (req, res) {
    res.render("create-user")
})

app.get("/home", function (req, res) {
    res.render("index")
})

app.get("/bohr", isLoggedIn, function (req, res) {
    res.render("./learning/bohr")
})

app.get("/periodic_table", async (req, res) => {
    res.render("periodic_table");
});

app.get("/atomic-position", function (req, res) {
    res.render("./learning/elements_location")
})

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("login");
});
//LEARNING SECTION
//LEARNING SECTION
//LEARNING SECTION
//LEARNING SECTION
                         
app.get("/learning", isLoggedIn, function (req, res) {
    res.render("learning_home")
})

app.get("/tricks_learn", function (req, res) {
    res.render("./learning/tricks")
})

app.get("/isotopes", function (req, res) {
    res.render("./learning/isotopes")
})

app.get("/atomic-trends", function (req, res) {
    res.render("./learning/atomic_trends")
})

app.get("/components_atom", function (req, res) {
    res.render("./learning/components_atom")
})

app.get("/quantum", function (req, res) {
    res.render("./learning/quantum")
})

app.get("/spdf",isLoggedIn, function (req, res) {
    res.render("./learning/learn_spdf")
})

app.get("/quiz",isLoggedIn, function (req, res) {
    res.render("quiz_home")
})

app.get("/H", function (req, res) {
    res.render("./s_block/H");
});

app.get("/Li", function (req, res) {
    res.render("./s_block/Li");
});

app.get("/Na", function (req, res) {
    res.render("./s_block/Na");
});

app.get("/K", function (req, res) {
    res.render("./s_block/K");
});

app.get("/Rb", function (req, res) {
    res.render("./s_block/Rb");
});

app.get("/Cs", function (req, res) {
    res.render("./s_block/Cs");
});

app.get("/Fr", function (req, res) {
    res.render("./s_block/Fr");
});

app.get("/Be", function (req, res) {
    res.render("./s_block/Be");
});

app.get("/Mg", function (req, res) {
    res.render("./s_block/Mg");
});

app.get("/Ca", function (req, res) {
    res.render("./s_block/Ca");
});

app.get("/Sr", function (req, res) {
    res.render("./s_block/Sr");
});
app.get("/Ba", function (rBa, res) {
    res.render("./s_block/Ba");
});
app.get("/Ra", function (req, res) {
    res.render("./s_block/Ra");
});


// ==========================================
// D-BLOCK ELEMENTS ROUTING (TOTAL 38 ELEMENTS)
// ==========================================


// --- 3d Series (Transition Elements - 10) ---
app.get("/Sc", function (req, res) {
    res.render("./d_block/Sc");
});
app.get("/Ti", function (req, res) {
    res.render("./d_block/Ti");
});
app.get("/V", function (req, res) {
    res.render("./d_block/V");
});
app.get("/Cr", function (req, res) {
    res.render("./d_block/Cr");
});
app.get("/Mn", function (req, res) {
    res.render("./d_block/Mn");
});
app.get("/Fe", function (req, res) {
    res.render("./d_block/Fe");
});
app.get("/Co", function (req, res) {
    res.render("./d_block/Co");
});
app.get("/Ni", function (req, res) {
    res.render("./d_block/Ni");
});
app.get("/Cu", function (req, res) {
    res.render("./d_block/Cu");
});
app.get("/Zn", function (req, res) {
    res.render("./d_block/Zn");
});

// --- 4d Series (Transition Elements - 10) ---
app.get("/Y", function (req, res) {
    res.render("./d_block/Y");
});
app.get("/Zr", function (req, res) {
    res.render("./d_block/Zr");
});
app.get("/Nb", function (req, res) {
    res.render("./d_block/Nb");
});
app.get("/Mo", function (req, res) {
    res.render("./d_block/Mo");
});
app.get("/Tc", function (req, res) {
    res.render("./d_block/Tc");
});
app.get("/Ru", function (req, res) {
    res.render("./d_block/Ru");
});
app.get("/Rh", function (req, res) {
    res.render("./d_block/Rh");
});
app.get("/Pd", function (req, res) {
    res.render("./d_block/Pd");
});
app.get("/Ag", function (req, res) {
    res.render("./d_block/Ag");
});
app.get("/Cd", function (req, res) {
    res.render("./d_block/Cd");
});

// --- 5d Series (Lutecium se Mercury - 9) ---

app.get("/Hf", function (req, res) {
    res.render("./d_block/Hf");
});
app.get("/Ta", function (req, res) {
    res.render("./d_block/Ta");
});
app.get("/W", function (req, res) {
    res.render("./d_block/W");
});
app.get("/Re", function (req, res) {
    res.render("./d_block/Re");
});
app.get("/Os", function (req, res) {
    res.render("./d_block/Os");
});
app.get("/Ir", function (req, res) {
    res.render("./d_block/Ir");
});
app.get("/Pt", function (req, res) {
    res.render("./d_block/Pt");
});
app.get("/Au", function (req, res) {
    res.render("./d_block/Au");
});
app.get("/Hg", function (req, res) {
    res.render("./d_block/Hg");
});

// --- 6d Series (Lawrencium se Copernicium - 9) ---

app.get("/Rf", function (req, res) {
    res.render("./d_block/Rf");
});
app.get("/Db", function (req, res) {
    res.render("./d_block/Db");
});
app.get("/Sg", function (req, res) {
    res.render("./d_block/Sg");
});
app.get("/Bh", function (req, res) {
    res.render("./d_block/Bh");
});
app.get("/Hs", function (req, res) {
    res.render("./d_block/Hs");
});
app.get("/Mt", function (req, res) {
    res.render("./d_block/Mt");
});
app.get("/Ds", function (req, res) {
    res.render("./d_block/Ds");
});
app.get("/Rg", function (req, res) {
    res.render("./d_block/Rg");
});
app.get("/Cn", function (req, res) {
    res.render("./d_block/Cn");
});


// ==========================================
// F-BLOCK ELEMENTS ROUTING (TOTAL 28 ELEMENTS)
// ==========================================


// --- Lanthanides (Cerium se Lutetium - 14) ---
app.get("/Ce", function (req, res) {
    res.render("./f_block/Ce")
})
app.get("/Pr", function (req, res) {
    res.render("./f_block/Pr")
})
app.get("/Nd", function (req, res) {
    res.render("./f_block/Nd")
})
app.get("/Pm", function (req, res) {
    res.render("./f_block/Pm")
})
app.get("/Sm", function (req, res) {
    res.render("./f_block/Sm")
})
app.get("/Eu", function (req, res) {
    res.render("./f_block/Eu")
})
app.get("/Gd", function (req, res) {
    res.render("./f_block/Gd")
})
app.get("/Tb", function (req, res) {
    res.render("./f_block/Tb")
})
app.get("/Dy", function (req, res) {
    res.render("./f_block/Dy")
})
app.get("/Ho", function (req, res) {
    res.render("./f_block/Ho")
})
app.get("/Er", function (req, res) {
    res.render("./f_block/Er")
})
app.get("/Tm", function (req, res) {
    res.render("./f_block/Tm")
})
app.get("/Yb", function (req, res) {
    res.render("./f_block/Yb")
})
app.get("/Lu", function (req, res) {
    res.render("./f_block/Lu")
})

// --- Actinides (Thorium se Lawrencium - 14) ---
app.get("/Th", function (req, res) {
    res.render("./f_block/Th")
})
app.get("/Pa", function (req, res) {
    res.render("./f_block/Pa")
})
app.get("/U", function (req, res) {
    res.render("./f_block/U")
})
app.get("/Np", function (req, res) {
    res.render("./f_block/Np")
})
app.get("/Pu", function (req, res) {
    res.render("./f_block/Pu")
})
app.get("/Am", function (req, res) {
    res.render("./f_block/Am")
})
app.get("/Cm", function (req, res) {
    res.render("./f_block/Cm")
})
app.get("/Bk", function (req, res) {
    res.render("./f_block/Bk")
})
app.get("/Cf", function (req, res) {
    res.render("./f_block/Cf")
})
app.get("/Es", function (req, res) {
    res.render("./f_block/Es")
})
app.get("/Fm", function (req, res) {
    res.render("./f_block/Fm")
})
app.get("/Md", function (req, res) {
    res.render("./f_block/Md")
})
app.get("/No", function (req, res) {
    res.render("./f_block/No")
})
app.get("/Lr", function (req, res) {
    res.render("./f_block/Lr")
})
app.get("/La", function (req, res) {
    res.render("./f_block/La")
})
app.get("/Ac", function (req, res) {
    res.render("./f_block/Ac")
})

// ==========================================
// BORON FAMILY (Group 13)
// ==========================================
app.get("/B", function (req, res) { res.render("./p_block/B"); });
app.get("/Al", function (req, res) { res.render("./p_block/Al"); });
app.get("/Ga", function (req, res) { res.render("./p_block/Ga"); });
app.get("/In", function (req, res) { res.render("./p_block/In"); });
app.get("/Tl", function (req, res) { res.render("./p_block/Tl"); });
app.get("/Nh", function (req, res) { res.render("./p_block/Nh"); });

// ==========================================
// CARBON FAMILY (Group 14)
// ==========================================
app.get("/C", function (req, res) { res.render("./p_block/C"); });
app.get("/Si", function (req, res) { res.render("./p_block/Si"); });
app.get("/Ge", function (req, res) { res.render("./p_block/Ge"); });
app.get("/Sn", function (req, res) { res.render("./p_block/Sn"); });
app.get("/Pb", function (req, res) { res.render("./p_block/Pb"); });
app.get("/Fl", function (req, res) { res.render("./p_block/Fl"); });

// ==========================================
// NITROGEN FAMILY (Group 15)
// ==========================================
app.get("/N", function (req, res) { res.render("./p_block/N"); });
app.get("/P", function (req, res) { res.render("./p_block/P"); });
app.get("/As", function (req, res) { res.render("./p_block/As"); });
app.get("/Sb", function (req, res) { res.render("./p_block/Sb"); });
app.get("/Bi", function (req, res) { res.render("./p_block/Bi"); });
app.get("/Mc", function (req, res) { res.render("./p_block/Mc"); });

// ==========================================
// OXYGEN FAMILY / Chalcogens (Group 16)
// ==========================================
app.get("/O", function (req, res) { res.render("./p_block/O"); });
app.get("/S", function (req, res) { res.render("./p_block/S"); });
app.get("/Se", function (req, res) { res.render("./p_block/Se"); });
app.get("/Te", function (req, res) { res.render("./p_block/Te"); });
app.get("/Po", function (req, res) { res.render("./p_block/Po"); });
app.get("/Lv", function (req, res) { res.render("./p_block/Lv"); });

// ==========================================
// HALOGENS (Group 17)
// ==========================================
app.get("/F", function (req, res) { res.render("./p_block/F"); });
app.get("/Cl", function (req, res) { res.render("./p_block/Cl"); });
app.get("/Br", function (req, res) { res.render("./p_block/Br"); });
app.get("/I", function (req, res) { res.render("./p_block/I"); });
app.get("/At", function (req, res) { res.render("./p_block/At"); });
app.get("/Ts", function (req, res) { res.render("./p_block/Ts"); });

// ==========================================
// NOBLE GASES (Group 18)
// ==========================================
app.get("/He", function (req, res) { res.render("./p_block/He"); });
app.get("/Ne", function (req, res) { res.render("./p_block/Ne"); });
app.get("/Ar", function (req, res) { res.render("./p_block/Ar"); });
app.get("/Kr", function (req, res) { res.render("./p_block/Kr"); });
app.get("/Xe", function (req, res) { res.render("./p_block/Xe"); });
app.get("/Rn", function (req, res) { res.render("./p_block/Rn"); });
app.get("/Og", function (req, res) { res.render("./p_block/Og"); });

app.get("/quiz1", function (req, res) {
    res.render("./quizs/quiz1")
})

app.get("/quiz2", function (req, res) {
    res.render("./quizs/quiz2")
})

app.get("/atomic-position_quiz", function (req, res) {
    res.render('./quizs/position')
})

app.get("/atomic-trends-quiz", function (req, res) {
    res.render("./quizs/quiz_atomic_trends")
})

app.get("/about", function (req, res) {
    res.render("about")
})

app.get("/terms", function (req, res) {
    res.render('terms')
})

app.get("/cookie", function(req, res){
    res.render('cookie')
})

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=> {
    console.log(`${PORT}`);
})