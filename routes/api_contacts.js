var express = require('express');
var router = express.Router();
var User = require("../models/User");
var Contact = require("../models/Contact");

/* GET  all contacts of user */
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
	// Get contacts
	User.findOne({username: req.params.username})
		.populate('contacts')
		.exec(function(err, user){
			if(err){
				return next(err);
			}
			return res.status(200).send({
				ok: true,
				message: "Contacts sent.",
				contacts: user.contacts
			});
		});
});

/* GET contact of user */
router.get('/:username/:name', function(req, res, next){
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
	//Get contact
	User.findOne({username: req.params.username})
		.populate('contacts')
		.exec(function(err, user){
			if(err){
				return next(err);
			}
			for(var i=0; i<user.contacts.length; i++){
				if(user.contacts[i].name === req.params.name){
					return res.status(200).send({
						ok: true,
						message: "Contact sent.",
						contact: user.contacts[i]
					});
				}
			}
			
			// If no contact, return 404.
			var err = new Error("Not found.");
			err.status = 404;
			return next(err);
		});
});

/* GET contact of user */
router.get('/:username/:telephone', function(req, res, next){
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
	//Get contact
	User.findOne({username: req.params.username})
		.populate('contacts')
		.exec(function(err, user){
			if(err){
				return next(err);
			}
			for(var i=0; i<user.contacts.length; i++){
				if(user.contacts[i].telephone === req.params.telephone){
					return res.status(200).send({
						ok: true,
						message: "Contact sent.",
						contact: user.contacts[i]
					});
				}
			}
			
			// If no contact, return 404.
			var err = new Error("Not found.");
			err.status = 404;
			return next(err);
		});
});

/* GET contact of user */
router.get('/:username/:email', function(req, res, next){
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
	//Get contact
	User.findOne({username: req.params.username})
		.populate('contacts')
		.exec(function(err, user){
			if(err){
				return next(err);
			}
			for(var i=0; i<user.contacts.length; i++){
				if(user.contacts[i].email === req.params.email){
					return res.status(200).send({
						ok: true,
						message: "Contact sent.",
						contact: user.contacts[i]
					});
				}
			}
			
			// If no contact, return 404.
			var err = new Error("Not found.");
			err.status = 404;
			return next(err);
		});
});

/* POST contact of user */
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

	if(!req.body.contact && !req.body.contacts){
		var err = new Error("Invalid request.");
		err.status = 400;
		return next(err);
	} else if(!req.body.contacts){
		// Create one contact
		var contact = JSON.parse(req.body.contact);
		// Create contact
		var newContact = new Contact(contact);
		newContact.save(function(err){
			if(err){
				return next(err);
			}
			User.update({username: req.params.username},{$push: { contacts: newContact._id}}, function(err){
				if(err){
					return next(err);
				}
				return res.status(200).send({
					ok: true,
					message: "Contact added to "+req.params.username
				});
			});
		});
	} else if(!req.body.contact){
		//Create multiple contacts req.body.contacts must be a string to be jsonified
		var contacts = JSON.parse(req.body.contacts);
		var newContact;
		for(var i=0; i<contacts.length; i++){
			// Create contact
			newContact = new Contact(contacts[i]);
			newContact.save(function(err){
				if(err){
					return next(err);
				}
				User.update({username: req.params.username},{$push: { contacts: newContact._id}}, function(err){
					if(err){
						return next(err);
					}
				});
			});
		}
		return res.status(200).send({
			ok: true,
			message: "Contacts added to "+req.params.username
		});
	}
});

/* PUT contact of user */
router.put('/:username/:name', function(req, res, next){
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
	//Check if updated data exists
	if(!req.body.contact){
		var err = new Error("Invalid request.");
		err.status = 400;
		return next(err);
	}
	//Get contact for update
	var contact = JSON.parse(req.body.contact);
	User.findOne({username: req.params.username})
		.populate('contacts')
		.exec(function(err, user){
			if(err){
				return next(err);
			}
			for(var i=0; i<user.contacts.length; i++){
				if(user.contacts[i].name === req.params.name){
					Contact.update({_id: user.contacts[i]._id}, {$set: contact), function(err){
						return res.status(200).send({
							ok: true,
							message: "Contact updated."
						});
					});
				}
			}
			
			// If no contact, return 404.
			var err = new Error("Not found.");
			err.status = 404;
			return next(err);
		});
});

/* PUT contact of user */
router.put('/:username/:telephone', function(req, res, next){
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
	//Check if updated data exists
	if(!req.body.contact){
		var err = new Error("Invalid request.");
		err.status = 400;
		return next(err);
	}
	//Get contact for update
	var contact = JSON.parse(req.body.contact);
	User.findOne({username: req.params.username})
		.populate('contacts')
		.exec(function(err, user){
			if(err){
				return next(err);
			}
			for(var i=0; i<user.contacts.length; i++){
				if(user.contacts[i].telephone === req.params.telephone){
					Contact.update({_id: user.contacts[i]._id}, {$set: contact), function(err){
						return res.status(200).send({
							ok: true,
							message: "Contact updated."
						});
					});
				}
			}
			
			// If no contact, return 404.
			var err = new Error("Not found.");
			err.status = 404;
			return next(err);
		});
});

/* PUT contact of user */
router.put('/:username/:email', function(req, res, next){
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
	//Check if updated data exists
	if(!req.body.contact){
		var err = new Error("Invalid request.");
		err.status = 400;
		return next(err);
	}
	//Get contact for update
	var contact = JSON.parse(req.body.contact);
	User.findOne({username: req.params.username})
		.populate('contacts')
		.exec(function(err, user){
			if(err){
				return next(err);
			}
			for(var i=0; i<user.contacts.length; i++){
				if(user.contacts[i].email === req.params.email){
					Contact.update({_id: user.contacts[i]._id}, {$set: contact), function(err){
						return res.status(200).send({
							ok: true,
							message: "Contact updated."
						});
					});
				}
			}
			
			// If no contact, return 404.
			var err = new Error("Not found.");
			err.status = 404;
			return next(err);
		});
});

module.exports = router;