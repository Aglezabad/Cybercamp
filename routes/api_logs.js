var express = require('express');
var router = express.Router();
var User = require("../models/User");
var Log = require("../models/Log");

router.post('/:username', function(req, res, next){
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

	if(!req.body.uri && !req.body.status){
		var err = new Error("Invalid request.");
		err.status = 400;
		return next(err);
	} else if(!req.body.contacts){
		// Create one contact
		var json = {
			"date": req.body.date,
			"uri": req.body.uri,
			"status": req.body.status
		};
	//	var log = JSON.parse(json);
		// Create contact
		var newLog = new Log(json);
		newLog.save(function(err){
			if(err){
				return next(err);
			}
			User.update({username: req.params.username},{$push: { logs: newLog._id}}, function(err){
				if(err){
					return next(err);
				}
				return res.status(200).send({
					ok: true,
					message: "Log added to "+req.params.username
				});
			});
		});
	}
});
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
	var reg =req.params.regex;
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
				if(user.logs[i].uri.indexOf(reg) > -1){
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
