const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//load person model
const Person = require('../../modules/Person');

//load Profile Model
const Profile = require('../../modules/Profile');

//@type     GET
//@route    /api/profile/
//@desc     route for personal user profile
//@access   PRIVATE

router.get(
    '/',
    passport.authenticate('jwt', {session:false}),
    (req,res)=>{
        Profile.findOne({user:req.user.id})
            .then( profile =>{
                if (!profile) {
                    return res.status(404).json({profilenotfound:'No profile found'})
                }
                res.json(profile);
            })
            .catch(err => console.log('got some error in profile '+err));          
})

//@type     POST
//@route    /api/profile/
//@desc     route for UPDATING/SAVING  personal user profile
//@access   PRIVATE

router.post(
    '/',
    passport.authenticate('jwt',{session:false}),
    (req,res)=>{
        const profileValues = {};
        profileValues.user = req.user.id;
        if(req.body.username) profileValues.username=req.body.username;
        if(req.body.website) profileValues.website=req.body.website;
        if(req.body.country) profileValues.country=req.body.country
        if(req.body.portfolio) profileValues.portfolio=req.body.portfolio;
        if (typeof req.body.languages!==undefined) {
           // profileValues.languages = req.body.languages.split(",");
        }
        profileValues.social = {};
        if(req.body.youtube) profileValues.social.youtube=req.body.youtube;
        if(req.body.facebook) profileValues.social.facebook=req.body.facebook;
        if(req.body.instagram) profileValues.social.instagram=req.body.instagram;

        //Do database stuff
        Profile.findOne({user:req.user.id})
            .then(profile =>{
                if (profile) {
                    Profile.findOneAndUpdate(
                        {user:req.user.id},
                        {$set:profileValues},
                        {new:true}
                    )
                    .then(profile => res.json(profile))
                    .catch(err => console.log('problem in updates '+err))
                }else{
                    Profile.findOne({username:profileValues.username})
                        .then(profile =>{
                            //username is already exists
                            if(profile){
                                res.status(400).json({username:'username is already exists'})
                            }
                            //save user

                            new Profile(profileValues)
                                .save()
                                .then(profile=>res.json(profile))
                                .catch(err => console.log('problem in save user '+err))
                        })
                        .catch(err => console.log('problem in username '+err))
                }
            })
            .catch(err => console.log('Problem in fetching profile '+err));
    }

);

//@type     GET
//@route    /api/profile/:username
//@desc     route for getting user profile based on username
//@access   PUBLIC

router.get('/:username',(req,res)=>{
    Profile.findOne({username:req.params.username})
        .populate('user',['name','profilpic'])
        .then(profile =>{
            if (!profile) {
                res.status(404).json({usernotfound:'user not found'})
            }
            res.json(profile);
        })
        .catch(err=>console.log('error in fetching username '+err));
});


//@type     GET
//@route    /api/profile/find/everyone
//@desc     route for getting user profile based on username
//@access   PUBLIC

router.get('/find/everyone',(req,res)=>{
    Profile.find()
        .populate('user',['name','profilpic'])
        .then(profile =>{
            if (!profile) {
                res.status(404).json({usernotfound:'user not found'})
            }
            res.json(profile);
        })
        .catch(err=>console.log('error in fetching username '+err));
});


//@type     DELETE
//@route    /api/profile/
//@desc     route for deleting user from database
//@access   PRIVATE

router.delete(
    '/',
    passport.authenticate('jwt',{session:false}),
    (req,res)=>{
        Profile.findOne({user:req.user.id});
        Profile.findOneAndRemove({user:req.user.id})
            .then( ()=>{
                Person.findOneAndRemove({_id:req.user.id})
                    .then(()=> res.json({success:'delete was success'}))
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    });



//@type     POST
//@route    /api/profile/workrole
//@desc     route for adding work profile for person
//@access   PRIVATE    

router.post(
    '/workrole',
    passport.authenticate('jwt',{session:false}),
    (req,res)=>{
        Profile.findOne({user:req.user.id})
            .then(profile =>{
                if (!profile) {
                    res.status(404).json({workrole:'work role not found'});
                }
                    const mywork ={
                        role:req.body.role,
                        company:req.body.company,
                        country:req.body.country,
                        from:req.body.from,
                        to:req.body.to,
                        current:req.body.current,
                        details:req.body.details,
                    };
                    profile.workrole.unshift(mywork);
                    profile
                        .save()
                        .then(profile => res.json(profile))
                        .catch(err => console.log(err))
            })
            .catch(err => console.log('problem in workrole '+err))
    }

)

//@type     DELETE
//@route    /api/profile/workrole/:w_id
//@desc     route for deleting a specific workrole
//@access   PRIVATE

router.delete(
    '/workrole/:w_id',
    passport.authenticate('jwt',{session:false}),
    (req,res)=>{
        Profile.findOne({user:req.user.id})
            .then(profile =>{
                //assignment
                const removethis = profile.workrole
                    .map(item => item.id)
                    .indexOf(req.params.w_id);

                    profile.workrole.splice(removethis,1);

                    profile
                        .save()
                        .then(profile => res.json(profile))
                        .catch(err =>console.log(err))
            })
            .catch(err => console.log(err))

    }
)

module.exports = router;