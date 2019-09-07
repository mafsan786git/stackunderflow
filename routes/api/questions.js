const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//load person model
const Person = require('../../modules/Person');

//load Profile Model
const Profile = require('../../modules/Profile');

//load Question Model
const Question = require('../../modules/Questions');


//@type     Post
//@route    /api/questions
//@desc     route questions
//@access   PRIVATE

router.get('/',(req,res) =>{
    Question
        .find()
        .sort({date:'desc'})
        .then(questions => res.json(questions))
        .catch(err => res.json({noquestions:'No questions to display'}))
});


//@type     Post
//@route    /api/questions
//@desc     route for submitting questions
//@access   PRIVATE

router.post(
    '/',
    passport.authenticate('jwt',{session:false}),
    (req,res)=>{
        const newQuestion = new Question({
            textOne:req.body.textOne,
            textTwo:req.body.textTwo,
            name:req.body.name,
            user:req.user.id
        });
        newQuestion
            .save()
            .then(question => res.json(question))
            .catch(err => console.log('problem in posting question'))
    }
);


//@type     Post
//@route    /api/answer/:id
//@desc     route for submitting answer
//@access   PRIVATE

router.post(
    '/answer/:id',
    passport.authenticate('jwt',{session:false}),
    (req,res)=>{
        Question.findById(req.params.id)
            .then( question =>{
                const newAnswer = {
                    user:req.user.id,
                    name:req.body.name,
                    text:req.body.text
                };
                question.answers.unshift(newAnswer);
                question
                    .save()
                    .then(question => {
                        res.json(question)
                    })
                    .catch(err => res.json({noanswer:'no answer is posted'}))
            })
            .catch(err => console.log(err))
    }
);



//@type     Post
//@route    /api/upVotes/:id
//@desc     route for voting answer
//@access   PRIVATE

router.post(
    '/upvote/:id',
    passport.authenticate('jwt',{session:false}),
    (req,res) =>{
        Profile.findOne({user:req.user.id})
            .then(profile => {
                Question.findById(req.params.id)
                  .then(question => {
                    if (
                      question.upVotes.filter(
                        upvote => upvote.user.toString() === req.user.id.toString()
                      ).length > 0
                    ) {
                      return res.status(400).json({ noupvote: "User already upvoted" });
                    }
                    question.upVotes.unshift({ user: req.user.id });
                    question
                      .save()
                      .then(question => res.json(question))
                      .catch(err => console.log(err));
                  })
                  .catch(err => console.log(err));
              })
            .catch(err => console.log(err))
    }
)



module.exports = router;