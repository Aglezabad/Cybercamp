var express = require('express');
var router = express.Router();
var User = require("../models/User");
var Log = require("../models/Log");

/* GET logs */
router.get('/:username', function(req, res, next){
	//Check session
	if(!req.session.user){
		var err = new Error("Forbidden.");
		err.status = 403;
		return next(err);
	}
	if((req.session.user.username !== req.params.username) && !req.session.user.groupAdmin){
		var err = new Error("Forbidden.");
		err.status = 403;
		return next(err);
	}
	// Get logs
	User.findOne({username: req.params.username})
		.populate('logs')
		.populate('reason')
		.exec(function(err, user){
			if(err){
				return next(err);
			}
			return res.status(200).send({
				ok: true,
				message: "Logs sent.",
				logs: user.logs
			});
		});
});

/* GET logs of user */
//:date in ISO format !!!!
router.get('/:username/filter-date/:date', function(req, res, next){
	//Check session
	if(!req.session.user){
		var err = new Error("Forbidden.");
		err.status = 403;
		return next(err);
	}
	if((req.session.user.username !== req.params.username) && !req.session.user.groupAdmin){
		var err = new Error("Forbidden.");
		err.status = 403;
		return next(err);
	}
	//Get logs
	User.findOne({username: req.params.username})
		.populate('logs')
		.populate('reason')
		.exec(function(err, user){
			if(err){
				return next(err);
			}
			var logArray = [];
			for(var i=0; i<user.logs.length; i++){
				if(user.logs[i].date === new Date(req.params.date)){
					logArray.push(user.logs[i]);
				}
			}

			if(logArray.length === 0){
				// If no contact, return 404.
				var err = new Error("Not found.");
				err.status = 404;
				return next(err);
			} else {
				return res.status(200).send({
					ok: true,
					message: "Logs sent.",
					logs: logArray
				});
			}
		});
});

/* GET logs of user */
//:regex checks URI!!!!
router.get('/:username/filter-regex/:regex', function(req, res, next){
	//Check session
	if(!req.session.user){
		var err = new Error("Forbidden.");
		err.status = 403;
		return next(err);
	}
	if((req.session.user.username !== req.params.username) && !req.session.user.groupAdmin){
		var err = new Error("Forbidden.");
		err.status = 403;
		return next(err);
	}
	//Get logs
	User.findOne({username: req.params.username})
		.populate('logs')
		.populate('reason')
		.exec(function(err, user){
			if(err){
				return next(err);
			}
			var logArray = [];
			for(var i=0; i<user.logs.length; i++){
				if(user.logs.uri.indexOf(req.params.regex) > -1){
					logArray.push(user.logs[i]);
				}
			}

			if(logArray.length === 0){
				// If no contact, return 404.
				var err = new Error("Not found.");
				err.status = 404;
				return next(err);
			} else {
				return res.status(200).send({
					ok: true,
					message: "Logs sent.",
					logs: logArray
				});
			}
		});
});

/* GET logs of user */
//:status
router.get('/:username/filter-status/:status', function(req, res, next){
	//Check session
	if(!req.session.user){
		var err = new Error("Forbidden.");
		err.status = 403;
		return next(err);
	}
	if((req.session.user.username !== req.params.username) && !req.session.user.groupAdmin){
		var err = new Error("Forbidden.");
		err.status = 403;
		return next(err);
	}
	//Get logs
	User.findOne({username: req.params.username})
		.populate('logs')
		.populate('reason')
		.exec(function(err, user){
			if(err){
				return next(err);
			}
			var logArray = [];
			for(var i=0; i<user.logs.length; i++){
				if(user.logs.status === req.params.status){
					logArray.push(user.logs[i]);
				}
			}

			if(logArray.length === 0){
				// If no contact, return 404.
				var err = new Error("Not found.");
				err.status = 404;
				return next(err);
			} else {
				return res.status(200).send({
					ok: true,
					message: "Logs sent.",
					logs: logArray
				});
			}
		});
});

/* GET logs of user */
//:reason !!!!
router.get('/:username/filter-reason/:reason', function(req, res, next){
	//Check session
	if(!req.session.user){
		var err = new Error("Forbidden.");
		err.status = 403;
		return next(err);
	}
	if((req.session.user.username !== req.params.username) && !req.session.user.groupAdmin){
		var err = new Error("Forbidden.");
		err.status = 403;
		return next(err);
	}
	//Get logs
	User.findOne({username: req.params.username})
		.populate('logs')
		.populate('reason')
		.exec(function(err, user){
			if(err){
				return next(err);
			}
			var logArray = [];
			for(var i=0; i<user.logs.length; i++){
				if(user.logs.reason.name.indexOf(req.params.reason) > -1){
					logArray.push(user.logs[i]);
				}
			}

			if(logArray.length === 0){
				// If no contact, return 404.
				var err = new Error("Not found.");
				err.status = 404;
				return next(err);
			} else {
				return res.status(200).send({
					ok: true,
					message: "Logs sent.",
					logs: logArray
				});
			}
		});
});

module.exports = router;