var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = require('../db')
var userCollection = db.collection('users');
var surveyCollection = db.collection('survey');
var surveyResultsCollection = db.collection('surveyResults');
var surveyTypesCollection = db.collection('surveyTypes');
var siteDataCollection = db.collection('siteData')






router.get('/survey/status', function(req, res, next) {
    res.json(surveyArray)
})


router.get('/surveys', function(req, res, next) {
    surveyCollection.find({}).sort({views: -1}).limit(3, function(err, featuredSurveys) {
        if (err) {
        console.log(err)
        }
      surveyCollection.find().sort({creationDateFormat: -1}, function(err, allSurveys) {   
            if (err) {
              console.log(err)
            }
            var allSurveys = allSurveys
        surveyCollection.find().sort({views: -1}, function(err, popularSurveys) {
          if (err) {
            console.log(err)
          }
          var popularSurveys = popularSurveys
            surveyCollection.find({py: "hunlian"}, function(err, hunlian) {
              if (err) {
                console.log(err)
              }
              var hunlianSurveys = hunlian
              surveyCollection.find({py: "jiankang"}, function(err, jiankang) {
                if (err) {
                  console.log(err)
                }
                var jiankangSurveys = jiankang
                surveyCollection.find({py: "zhichang"}, function(err, zhichang) {
                  if (err) {
                    console.log(err)
                  }
                  var zhichangSurveys = zhichang
                  surveyCollection.find({py: "xingxinli"}, function(err, xingxinli) {
                    if (err) {
                      console.log(err)
                    }
                    var xingxinliSurveys = xingxinli
                    surveyCollection.find({py: "kepu"}, function(err, kepu) {
                      if (err) {
                        console.log(err)
                      }
                      var kepuSurveys = kepu
                      surveyCollection.find({py: "chengzhang"}, function(err, chengzhang) {
                        if (err) {
                          console.log(err)
                        }
                        var chengzhangSurveys = chengzhang
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
                            hunlianSurveys,
                            jiankangSurveys,
                            zhichangSurveys,
                            xingxinliSurveys,
                            kepuSurveys,
                            chengzhangSurveys,
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
            console.log(err)
        } 
        console.log(data)
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
            console.log(err)
        }
        if (doc) {
            console.log(doc.analysis)
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