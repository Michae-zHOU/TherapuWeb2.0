var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = require('../db')
var userCollection = db.collection('users');
var surveyCollection = db.collection('survey');
var surveyResultsCollection = db.collection('surveyResults');
var surveyTypesCollection = db.collection('surveyTypes');
var siteDataCollection = db.collection('siteData')

function authorRequired(req, res, next) {
    //console.error(req.admin ? req.admin : 'no user')
	if (!req.isAuthenticated()) {
		return res.redirect('/login')
    }
	next()
}
function adminRequired(req, res, next) {
    //console.error(req.admin ? req.admin : 'no user')
	if (!req.user || req.user.admin == 1) {
		return res.redirect('/login')
    }
	next()
}




router.get('/survey/status', adminRequired, function(req, res, next) {
    res.json(surveyArray)
})

router.get('/survey/edit/:id', authorRequired ,function(req, res, next) {
    const {id} = req.params;
    surveyCollection.findOne({_id: mongojs.ObjectId(id)}, function(err, survey) {
        res.render('editSurvey', { 
            partials: {
                header: '../views/partials/header',
                head: '../views/partials/head',
                scripts: '../views/partials/scripts',
                footer: '../views/partials/footer'
            },
            survey,
            title: 'Edit Survey',
            auth: function() {
                if (req.user) {
                    return req.user.admin
                }
            }, 
        });
    })
})
router.post('/survey/edit/:id', authorRequired,function(req, res, next) {
    const { id } = req.params;
    const updatedSurvey = req.body;
    surveyCollection.findOne({_id: mongojs.ObjectId(id)}, function(err, original) {
        if (err) {
            return err
        }
          var q1 = {
            title: updatedSurvey.q1t,
            index: 1,
            mc1: {
                mc: updatedSurvey.q1m1,
                pt: updatedSurvey.q1m1p,
            },
            mc2: {
                mc: updatedSurvey.q1m2,
                pt: updatedSurvey.q1m2p,
            },
            mc3: {
                mc: updatedSurvey.q1m3,
                pt: updatedSurvey.q1m3p,
            },
            mc4: {
                mc: updatedSurvey.q1m4,
                pt: updatedSurvey.q1m4p,
            }
        }
        var q2 = {
                    title: updatedSurvey.q2t,
                    index: 2,
                    mc1: {
                            mc: updatedSurvey.q2m1,
                            pt: updatedSurvey.q2m1p,
                    },
                    mc2: {
                        mc: updatedSurvey.q2m2,
                        pt: updatedSurvey.q2m2p,
                    },
                    mc3: {
                        mc: updatedSurvey.q2m3,
                        pt: updatedSurvey.q2m3p,
                    },
                    mc4: {
                        mc: updatedSurvey.q2m4,
                        pt: updatedSurvey.q2m4p,
                    }
                }
        var q3 = {
                    title: updatedSurvey.q3t,
                    index: 3,
                    mc1: {
                        mc: updatedSurvey.q3m1,
                        pt: updatedSurvey.q3m1p,
                    },
                    mc2: {
                        mc: updatedSurvey.q3m2,
                        pt: updatedSurvey.q3m2p,
                    },
                    mc3: {
                        mc: updatedSurvey.q3m3,
                        pt: updatedSurvey.q3m3p,
                    },
                    mc4: {
                        mc: updatedSurvey.q3m4,
                        pt: updatedSurvey.q3m4p,
                    }
                }
        var q4 = {
                    title: updatedSurvey.q4t,
                    index: 4,
                    mc1: {
                        mc: updatedSurvey.q4m1,
                        pt: updatedSurvey.q4m1p,
                    },
                    mc2: {
                        mc: updatedSurvey.q4m2,
                        pt: updatedSurvey.q4m2p,
                    },
                    mc3: {
                        mc: updatedSurvey.q4m3,
                        pt: updatedSurvey.q4m3p,
                    },
                    mc4: {
                        mc: updatedSurvey.q4m4,
                        pt: updatedSurvey.q4m4p,
                    }
                }
        var q5 = {
                    title: updatedSurvey.q5t,
                    index: 5,
                    mc1: {
                        mc: updatedSurvey.q5m1,
                        pt: updatedSurvey.q5m1p,
                    },
                    mc2: {
                        mc: updatedSurvey.q5m2,
                        pt: updatedSurvey.q5m2p,
                    },
                    mc3: {
                        mc: updatedSurvey.q5m3,
                        pt: updatedSurvey.q5m3p,
                    },
                    mc4: {
                        mc: updatedSurvey.q5m4,
                        pt: updatedSurvey.q5m4p,
                    }
                }
        var q6 = {
                    title: updatedSurvey.q6t,
                    index: 6,
                    mc1: {
                        mc: updatedSurvey.q6m1,
                        pt: updatedSurvey.q6m1p,
                    },
                    mc2: {
                        mc: updatedSurvey.q6m2,
                        pt: updatedSurvey.q6m2p,
                    },
                    mc3: {
                        mc: updatedSurvey.q6m3,
                        pt: updatedSurvey.q6m3p,
                    },
                    mc4: {
                        mc: updatedSurvey.q6m4,
                        pt: updatedSurvey.q6m4p,
                    }
                }
        var q7 = {
                    title: updatedSurvey.q7t,
                    index: 7,
                    mc1: {
                        mc: updatedSurvey.q7m1,
                        pt: updatedSurvey.q7m1p,
                    },
                    mc2: {
                        mc: updatedSurvey.q7m2,
                        pt: updatedSurvey.q7m2p,
                    },
                    mc3: {
                        mc: updatedSurvey.q7m3,
                        pt: updatedSurvey.q7m3p,
                    },
                    mc4: {
                        mc: updatedSurvey.q1m4,
                        pt: updatedSurvey.q7m4p,
                    }
                }
        var q8 = {
                    title: updatedSurvey.q8t,
                    index: 8,
                    mc1: {
                        mc: updatedSurvey.q8m1,
                        pt: updatedSurvey.q8m1p,
                    },
                    mc2: {
                        mc: updatedSurvey.q8m2,
                        pt: updatedSurvey.q8m2p,
                    },
                    mc3: {
                        mc: updatedSurvey.q8m3,
                        pt: updatedSurvey.q8m3p,
                    },
                    mc4: {
                        mc: updatedSurvey.q8m4,
                        pt: updatedSurvey.q8m4p,
                    }
                }
        var q9 = {
                    title: updatedSurvey.q9t,
                    index: 9,
                    mc1: {
                        mc: updatedSurvey.q9m1,
                        pt: updatedSurvey.q9m1p,
                    },
                    mc2: {
                        mc: updatedSurvey.q9m2,
                        pt: updatedSurvey.q9m2p,
                    },
                    mc3: {
                        mc: updatedSurvey.q9m3,
                        pt: updatedSurvey.q9m3p,
                    },
                    mc4: {
                        mc: updatedSurvey.q9m4,
                        pt: updatedSurvey.q9m4p,
                    }
                }
        var q10 = {
                    title: updatedSurvey.q10t,
                    index: 10,
                    mc1: {
                        mc: updatedSurvey.q10m1,
                        pt: updatedSurvey.q10m1p,
                    },
                    mc2: {
                        mc: updatedSurvey.q10m2,
                        pt: updatedSurvey.q10m2p,
                    },
                    mc3: {
                        mc: updatedSurvey.q10m3,
                        pt: updatedSurvey.q10m3p,
                    },
                    mc4: {
                        mc: updatedSurvey.q10m4,
                        pt: updatedSurvey.q10m4p,
                    }
                }

        var q11 = {
                    title: updatedSurvey.q11t,
                    index: 11,
                    mc1: {
                        mc: updatedSurvey.q11m1,
                        pt: updatedSurvey.q11m1p,
                    },
                    mc2: {
                        mc: updatedSurvey.q11m2,
                        pt: updatedSurvey.q11m2p,
                    },
                    mc3: {
                        mc: updatedSurvey.q11m3,
                        pt: updatedSurvey.q11m3p,
                    },
                    mc4: {
                        mc: updatedSurvey.q11m4,
                        pt: updatedSurvey.q11m4p,
                    }
                }
        var q12 = {
                    title: updatedSurvey.q12t,
                    index: 12,
                    mc1: {
                        mc: updatedSurvey.q12m1,
                        pt: updatedSurvey.q12m1p,
                    },
                    mc2: {
                        mc: updatedSurvey.q12m2,
                        pt: updatedSurvey.q12m2p,
                    },
                    mc3: {
                        mc: updatedSurvey.q12m3,
                        pt: updatedSurvey.q12m3p,
                    },
                    mc4: {
                        mc: updatedSurvey.q12m4,
                        pt: updatedSurvey.q12m4p,
                    }
                }
        var q13 = {
                    title: updatedSurvey.q13t,
                    index: 13,
                    mc1: {
                        mc: updatedSurvey.q13m1,
                        pt: updatedSurvey.q13m1p,
                    },
                    mc2: {
                        mc: updatedSurvey.q13m2,
                        pt: updatedSurvey.q13m2p,
                    },
                    mc3: {
                        mc: updatedSurvey.q13m3,
                        pt: updatedSurvey.q13m3p,
                    },
                    mc4: {
                        mc: updatedSurvey.q13m4,
                        pt: updatedSurvey.q13m4p,
                    }
                }
        var q14 = {
                    title: updatedSurvey.q14t,
                    index: 14,
                    mc1: {
                        mc: updatedSurvey.q14m1,
                        pt: updatedSurvey.q14m1p,
                    },
                    mc2: {
                        mc: updatedSurvey.q14m2,
                        pt: updatedSurvey.q14m2p,
                    },
                    mc3: {
                        mc: updatedSurvey.q14m3,
                        pt: updatedSurvey.q14m3p,
                    },
                    mc4: {
                        mc: updatedSurvey.q14m4,
                        pt: updatedSurvey.q14m4p,
                    }
                }
        var q15 = {
                    title: updatedSurvey.q15t,
                    index: 15,
                    mc1: {
                        mc: updatedSurvey.q15m1,
                        pt: updatedSurvey.q15m1p,
                    },
                    mc2: {
                        mc: updatedSurvey.q15m2,
                        pt: updatedSurvey.q15m2p,
                    },
                    mc3: {
                        mc: updatedSurvey.q15m3,
                        pt: updatedSurvey.q15m3p,
                    },
                    mc4: {
                        mc: updatedSurvey.q15m4,
                        pt: updatedSurvey.q15m4p,
                    }
                }
        var q16 = {
                    title: updatedSurvey.q16t,
                    index: 16,
                    mc1: {
                        mc: updatedSurvey.q16m1,
                        pt: updatedSurvey.q16m1p,
                    },
                    mc2: {
                        mc: updatedSurvey.q16m2,
                        pt: updatedSurvey.q16m2p,
                    },
                    mc3: {
                        mc: updatedSurvey.q16m3,
                        pt: updatedSurvey.q16m3p,
                    },
                    mc4: {
                        mc: updatedSurvey.q16m4,
                        pt: updatedSurvey.q16m4p,
                    }
                }
        var q17 = {
                    title: updatedSurvey.q17t,
                    index: 17,
                    mc1: {
                        mc: updatedSurvey.q17m1,
                        pt: updatedSurvey.q17m1p,
                    },
                    mc2: {
                        mc: updatedSurvey.q17m2,
                        pt: updatedSurvey.q17m2p,
                    },
                    mc3: {
                        mc: updatedSurvey.q17m3,
                        pt: updatedSurvey.q17m3p,
                    },
                    mc4: {
                        mc: updatedSurvey.q17m4,
                        pt: updatedSurvey.q17m4p,
                    }
                }
        var q18 = {
                    title: updatedSurvey.q18t,
                    index: 18,
                    mc1: {
                        mc: updatedSurvey.q18m1,
                        pt: updatedSurvey.q18m1p,
                    },
                    mc2: {
                        mc: updatedSurvey.q18m2,
                        pt: updatedSurvey.q18m2p,
                    },
                    mc3: {
                        mc: updatedSurvey.q18m3,
                        pt: updatedSurvey.q18m3p,
                    },
                    mc4: {
                        mc: updatedSurvey.q18m4,
                        pt: updatedSurvey.q18m4p,
                    }
                }
        var q19 = {
                    title: updatedSurvey.q19t,
                    index: 19,
                    mc1: {
                        mc: updatedSurvey.q19m1,
                        pt: updatedSurvey.q19m1p,
                    },
                    mc2: {
                        mc: updatedSurvey.q19m2,
                        pt: updatedSurvey.q19m2p,
                    },
                    mc3: {
                        mc: updatedSurvey.q19m3,
                        pt: updatedSurvey.q19m3p,
                    },
                    mc4: {
                        mc: updatedSurvey.q19m4,
                        pt: updatedSurvey.q19m4p,
                    }
                }
        var q20 = {
                    title: updatedSurvey.q20t,
                    index: 20,
                    mc1: {
                        mc: updatedSurvey.q20m1,
                        pt: updatedSurvey.q20m1p,
                    },
                    mc2: {
                        mc: updatedSurvey.q20m2,
                        pt: updatedSurvey.q20m2p,
                    },
                    mc3: {
                        mc: updatedSurvey.q20m3,
                        pt: updatedSurvey.q20m3p,
                    },
                    mc4: {
                        mc: updatedSurvey.q20m4,
                        pt: updatedSurvey.q20m4p,
                    }
                }
        var questions = [
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
        ]
        
        surveyCollection.update({_id: mongojs.ObjectId(id)}, {
            title: updatedSurvey.title,
            description: updatedSurvey.description,
            questionNumber: original.questionNumber,
            createdDateFormat: original.createdDateFormat,
            created_at: original.created_at,
            author: original.author,
            views: original.views,
            done: original.done,
            analysis: [
                {
                    range: original.analysis[0].range,
                    title: updatedSurvey.range1Title,
                    content: updatedSurvey.range1Content
                },
                {
                    range: original.analysis[1].range,
                    title: updatedSurvey.range2Title,
                    content: updatedSurvey.range2Content
                },
                {
                    range: original.analysis[2].range,
                    title: updatedSurvey.range3Title,
                    content: updatedSurvey.range3Content
                },
                {
                    range: original.analysis[3].range,
                    title: updatedSurvey.range4Title,
                    content: updatedSurvey.range4Content
                }
            ],
            questions,
            type: original.type,
            py: original.type,
            surveyImg: original.surveyImg
        }, function(err, updatedRecord) {
            req.flash('updateMessage', 'Updated Successfully!')
            res.redirect('/setting')
        })
    })
    
})
router.get('/surveys', function(req, res, next) {
    surveyCollection.find({}).sort({views: -1}).limit(3, function(err, featuredSurveys) {
        if (err) {
        console.error(err)
        }
      surveyCollection.find().sort({creationDateFormat: -1}, function(err, allSurveys) {   
            if (err) {
              console.error(err)
            }
            var allSurveys = allSurveys
        surveyCollection.find().sort({views: -1}, function(err, popularSurveys) {
          if (err) {
            console.error(err)
          }
          var popularSurveys = popularSurveys
            surveyCollection.find({py: "nengli"}, function(err, nengli) {
              if (err) {
                console.error(err)
              }
              var nengliSurveys = nengli
              surveyCollection.find({py: "xingge"}, function(err, xingge) {
                if (err) {
                  console.error(err)
                }
                var xinggeSurveys = xingge
                surveyCollection.find({py: "jiandan"}, function(err, jiandan) {
                  if (err) {
                    console.error(err)
                  }
                  var jiandanSurveys = jiandan
                  surveyCollection.find({py: "zhuanye"}, function(err, zhuanye) {
                    if (err) {
                      console.error(err)
                    }
                    var zhuanyeSurveys = zhuanye
                    surveyCollection.find({py: "quwei"}, function(err, quwei) {
                      if (err) {
                        console.error(err)
                      }
                      var quweiSurveys = quwei
                        siteDataCollection.find(function(err, siteData) {
                          var banner = siteData[0].homePageBanner;
                          res.render('surveys', { 
                            partials: {
                              header: '../views/partials/header',
                              head: '../views/partials/head',
                              scripts: '../views/partials/scripts',
                              footer: '../views/partials/footer'
                            },
                            featuredSurveys,
                            allSurveys,
                            popularSurveys,
                            nengliSurveys,
                            xinggeSurveys,
                            jiandanSurveys,
                            zhuanyeSurveys,
                            quweiSurveys,
                            banner,
                            title: 'Home',
                            auth: function() {
                              if (req.user) {
                                  return req.user.admin
                              }
                            }, 
                          });
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })




//user finishes survey and submits
router.post('/survey/done', (req, res, next)=> {
    
    const survey = req.body;
    var survey_id = survey.id;
    var surveyNum = survey.questionNum;
    var surveyEmail = survey.email;
    var surveyName = survey.name;

    delete survey['id'] && delete survey['name'] && delete survey['email'] && delete survey['questionNum'];
   
    var result = Object.keys(survey).map(function(e) {
        return survey[e].split('|');
    });

    //get score

    var totalPoint = 0;
    for (i = 0; i < result.length; i ++) {
        var points = Number(result[i][0])
        totalPoint = totalPoint + points
    }

    //get mc

    var mcArray = []
    for (i = 0; i < result.length; i ++) {
        var mc = result[i][1]
        mcArray.push(mc)
    }


    //get date
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    newdate = year + " 年 " + month + " 月 " + day + " 日 ";

    //get range
    surveyCollection.find({_id: mongojs.ObjectId(survey_id)}, function(err, data) {
        if (err) {
            console.error(err)
        } 
        console.error(data)
        var newSurveyResult = {
            name: survey.name,
            email: survey.email,
            survey_id,
            created_at: newdate,
            createdDateFormat: dateObj,
            ip: req.ip,
            analysis: data,
            results: mcArray,
            score: totalPoint,
        }
        surveyCollection.update({_id: mongojs.ObjectId(survey_id)}, {$inc: {done: 1}},function(err, survey) {
            surveyResultsCollection.save(newSurveyResult, function(err, doc) {
                req.session.identity = survey_id;
                res.redirect('/survey/result/' + doc._id);
            })
        })
    })
})

router.get('/survey/:id', function(req, res, next) {
    var { id } = req.params;
    surveyCollection.findOne({_id: mongojs.ObjectId(id)}, function(err, doc) {
        surveyCollection.update({_id: mongojs.ObjectId(id)}, {$inc: {views: 1}}, function(err, updatedSurvey) {
            res.render('surveyDetail', { 
                partials: {
                header: '../views/partials/header',
                footer: '../views/partials/footer',
                head: '../views/partials/head',
                scripts: '../views/partials/scripts'
                },
                title: 'Home',
                surveyData: JSON.stringify(doc),
                survey: doc,
                surveyQuestions: doc.questions,
                auth: function() {
                    if (req.user) {
                        return req.user.admin
                    }
                }, 
            });
        })
    })
})

router.get('/survey/result/:id', (req, res, next) => {

    const { id } = req.params;
    surveyResultsCollection.findOne({_id: mongojs.ObjectId(id)}, function(err, doc) {
        if (err) {
            console.error(err)
        }
        if (doc) {
            console.error(doc.analysis)
            res.render('surveyResult', { 
                partials: {
                header: '../views/partials/header',
                footer: '../views/partials/footer',
                head: '../views/partials/head',
                scripts: '../views/partials/scripts'
                },
                title: 'Home',
                surveyData: doc,
                userName: doc.name ? doc.name : '亲',
                analysis: doc.analysis[0].analysis,
                auth: function() {
                    if (req.user) {
                        return req.user.admin
                    }
                }, 
            });
        }
    })
})
   

module.exports = router;