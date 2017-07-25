var express = require('express');
var router = express.Router();
var db = require('../db')
var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/assets/surveys/')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${file.originalname}`)
  }
})

var upload = multer({ storage: storage })
/* GET home page. */
function authorRequired(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.redirect('/login')
	}
	next()
}
function adminRequired(req, res, next) {
	if (req.user.admin !== 2) {
		return res.redirect('/login')
	}
	next()
}

router.post('/survey/new/generate', authorRequired, function(req, res, next) {
    var surveyInfo = req.body
    var typeInfo = surveyInfo.type.split(',')
    var type = typeInfo[0]
    var py = typeInfo[1]
    res.render('createSurvey', {
        partials: {
            header: '../views/partials/header',
            footer: '../views/partials/footer',
            head: '../views/partials/head',
            scripts: '../views/partials/scripts'
        },
        title: '问卷创建工具',
        surveyTitle: surveyInfo.title,
        surveyNumber: surveyInfo.number,
        surveyType: surveyInfo.type,
        auth: function() {
            if (req.user) {
                return req.user.admin
            }
        }, 
    })
})


router.post('/survey/new/create', authorRequired, upload.single('surveyImg'), function(req, res, next) {
    var survey = req.body;
    var questions = []


    var q1 = {
            title: survey.q1t,
            index: 1,
            mc1: {
                mc: survey.q1m1,
                pt: survey.q1m1p,
            },
            mc2: {
                mc: survey.q1m2,
                pt: survey.q1m2p,
            },
            mc3: {
                mc: survey.q1m3,
                pt: survey.q1m3p,
            },
            mc4: {
                mc: survey.q1m4,
                pt: survey.q1m4p,
            }
        }
var q2 = {
            title: survey.q2t,
            index: 2,
            mc1: {
                    mc: survey.q2m1,
                    pt: survey.q2m1p,
            },
            mc2: {
                mc: survey.q2m2,
                pt: survey.q2m2p,
            },
            mc3: {
                mc: survey.q2m3,
                pt: survey.q2m3p,
            },
            mc4: {
                mc: survey.q2m4,
                pt: survey.q2m4p,
            }
        }
var q3 = {
            title: survey.q3t,
            index: 3,
            mc1: {
                mc: survey.q3m1,
                pt: survey.q3m1p,
            },
            mc2: {
                mc: survey.q3m2,
                pt: survey.q3m2p,
            },
            mc3: {
                mc: survey.q3m3,
                pt: survey.q3m3p,
            },
            mc4: {
                mc: survey.q3m4,
                pt: survey.q3m4p,
            }
        }
var q4 = {
            title: survey.q4t,
            index: 4,
            mc1: {
                mc: survey.q4m1,
                pt: survey.q4m1p,
            },
            mc2: {
                mc: survey.q4m2,
                pt: survey.q4m2p,
            },
            mc3: {
                mc: survey.q4m3,
                pt: survey.q4m3p,
            },
            mc4: {
                mc: survey.q4m4,
                pt: survey.q4m4p,
            }
        }
var q5 = {
            title: survey.q5t,
            index: 5,
            mc1: {
                mc: survey.q5m1,
                pt: survey.q5m1p,
            },
            mc2: {
                mc: survey.q5m2,
                pt: survey.q5m2p,
            },
            mc3: {
                mc: survey.q5m3,
                pt: survey.q5m3p,
            },
            mc4: {
                mc: survey.q5m4,
                pt: survey.q5m4p,
            }
        }
var q6 = {
            title: survey.q6t,
            index: 6,
            mc1: {
                mc: survey.q6m1,
                pt: survey.q6m1p,
            },
            mc2: {
                mc: survey.q6m2,
                pt: survey.q6m2p,
            },
            mc3: {
                mc: survey.q6m3,
                pt: survey.q6m3p,
            },
            mc4: {
                mc: survey.q6m4,
                pt: survey.q6m4p,
            }
        }
var q7 = {
            title: survey.q7t,
            index: 7,
            mc1: {
                mc: survey.q7m1,
                pt: survey.q7m1p,
            },
            mc2: {
                mc: survey.q7m2,
                pt: survey.q7m2p,
            },
            mc3: {
                mc: survey.q7m3,
                pt: survey.q7m3p,
            },
            mc4: {
                mc: survey.q1m4,
                pt: survey.q7m4p,
            }
        }
var q8 = {
            title: survey.q8t,
            index: 8,
            mc1: {
                mc: survey.q8m1,
                pt: survey.q8m1p,
            },
            mc2: {
                mc: survey.q8m2,
                pt: survey.q8m2p,
            },
            mc3: {
                mc: survey.q8m3,
                pt: survey.q8m3p,
            },
            mc4: {
                mc: survey.q8m4,
                pt: survey.q8m4p,
            }
        }
var q9 = {
            title: survey.q9t,
            index: 9,
            mc1: {
                mc: survey.q9m1,
                pt: survey.q9m1p,
            },
            mc2: {
                mc: survey.q9m2,
                pt: survey.q9m2p,
            },
            mc3: {
                mc: survey.q9m3,
                pt: survey.q9m3p,
            },
            mc4: {
                mc: survey.q9m4,
                pt: survey.q9m4p,
            }
        }
var q10 = {
            title: survey.q10t,
            index: 10,
            mc1: {
                mc: survey.q10m1,
                pt: survey.q10m1p,
            },
            mc2: {
                mc: survey.q10m2,
                pt: survey.q10m2p,
            },
            mc3: {
                mc: survey.q10m3,
                pt: survey.q10m3p,
            },
            mc4: {
                mc: survey.q10m4,
                pt: survey.q10m4p,
            }
        }

var q11 = {
            title: survey.q11t,
            index: 11,
            mc1: {
                mc: survey.q11m1,
                pt: survey.q11m1p,
            },
            mc2: {
                mc: survey.q11m2,
                pt: survey.q11m2p,
            },
            mc3: {
                mc: survey.q11m3,
                pt: survey.q11m3p,
            },
            mc4: {
                mc: survey.q11m4,
                pt: survey.q11m4p,
            }
        }
var q12 = {
            title: survey.q12t,
            index: 12,
            mc1: {
                mc: survey.q12m1,
                pt: survey.q12m1p,
            },
            mc2: {
                mc: survey.q12m2,
                pt: survey.q12m2p,
            },
            mc3: {
                mc: survey.q12m3,
                pt: survey.q12m3p,
            },
            mc4: {
                mc: survey.q12m4,
                pt: survey.q12m4p,
            }
        }
var q13 = {
            title: survey.q13t,
            index: 13,
            mc1: {
                mc: survey.q13m1,
                pt: survey.q13m1p,
            },
            mc2: {
                mc: survey.q13m2,
                pt: survey.q13m2p,
            },
            mc3: {
                mc: survey.q13m3,
                pt: survey.q13m3p,
            },
            mc4: {
                mc: survey.q13m4,
                pt: survey.q13m4p,
            }
        }
var q14 = {
            title: survey.q14t,
            index: 14,
            mc1: {
                mc: survey.q14m1,
                pt: survey.q14m1p,
            },
            mc2: {
                mc: survey.q14m2,
                pt: survey.q14m2p,
            },
            mc3: {
                mc: survey.q14m3,
                pt: survey.q14m3p,
            },
            mc4: {
                mc: survey.q14m4,
                pt: survey.q14m4p,
            }
        }
var q15 = {
            title: survey.q15t,
            index: 15,
            mc1: {
                mc: survey.q15m1,
                pt: survey.q15m1p,
            },
            mc2: {
                mc: survey.q15m2,
                pt: survey.q15m2p,
            },
            mc3: {
                mc: survey.q15m3,
                pt: survey.q15m3p,
            },
            mc4: {
                mc: survey.q15m4,
                pt: survey.q15m4p,
            }
        }
var q16 = {
            title: survey.q16t,
            index: 16,
            mc1: {
                mc: survey.q16m1,
                pt: survey.q16m1p,
            },
            mc2: {
                mc: survey.q16m2,
                pt: survey.q16m2p,
            },
            mc3: {
                mc: survey.q16m3,
                pt: survey.q16m3p,
            },
            mc4: {
                mc: survey.q16m4,
                pt: survey.q16m4p,
            }
        }
var q17 = {
            title: survey.q17t,
            index: 17,
            mc1: {
                mc: survey.q17m1,
                pt: survey.q17m1p,
            },
            mc2: {
                mc: survey.q17m2,
                pt: survey.q17m2p,
            },
            mc3: {
                mc: survey.q17m3,
                pt: survey.q17m3p,
            },
            mc4: {
                mc: survey.q17m4,
                pt: survey.q17m4p,
            }
        }
var q18 = {
            title: survey.q18t,
            index: 18,
            mc1: {
                mc: survey.q18m1,
                pt: survey.q18m1p,
            },
            mc2: {
                mc: survey.q18m2,
                pt: survey.q18m2p,
            },
            mc3: {
                mc: survey.q18m3,
                pt: survey.q18m3p,
            },
            mc4: {
                mc: survey.q18m4,
                pt: survey.q18m4p,
            }
        }
var q19 = {
            title: survey.q19t,
            index: 19,
            mc1: {
                mc: survey.q19m1,
                pt: survey.q19m1p,
            },
            mc2: {
                mc: survey.q19m2,
                pt: survey.q19m2p,
            },
            mc3: {
                mc: survey.q19m3,
                pt: survey.q19m3p,
            },
            mc4: {
                mc: survey.q19m4,
                pt: survey.q19m4p,
            }
        }
var q20 = {
            title: survey.q20t,
            index: 20,
            mc1: {
                mc: survey.q20m1,
                pt: survey.q20m1p,
            },
            mc2: {
                mc: survey.q20m2,
                pt: survey.q20m2p,
            },
            mc3: {
                mc: survey.q20m3,
                pt: survey.q20m3p,
            },
            mc4: {
                mc: survey.q20m4,
                pt: survey.q20m4p,
            }
        }
    
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    newdate = year + " 年 " + month + " 月 " + day + " 日 ";
    var typeInfo = survey.surveyType.split(',')
    var type = typeInfo[0]
    var py = typeInfo[1]

    var newSurvey = {
        title: survey.surveyTitle,
        description: survey.description,
        questionNumber: survey.surveyNumber,
        createdDateFormat: new Date(),
        created_at: newdate,
        author: req.user,
        views: 0,
        done: 0,
        analysis: [
            {
                range: '0 - 25 分',
                title: survey.range1Title,
                content: survey.range1Content
            },
            {   
                range: '25 - 50 分',
                title: survey.range2Title,
                content: survey.range2Content
            },
            {
                range: '50 - 75 分',
                title: survey.range3Title,
                content: survey.range3Content
            },
            {
                range: '75 - 100 分',
                title: survey.range4Title,
                content: survey.range4Content
            },
        ],
        questions: [
        q1,
        q2,
        q3,
        q4,
        q5,
        q6,
        q7,
        q8,
        q9,
        q10,
        q11,
        q12,
        q13,
        q14,
        q15,
        q16,
        q17,
        q18,
        q19,
        q20
        ],
        type,
        py,
        surveyImg: req.file,
        
    }
    var surveyCollection = db.collection('survey');
    surveyCollection.save(newSurvey, (err, doc) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/surveys')
        }
    });
})



module.exports = router;
