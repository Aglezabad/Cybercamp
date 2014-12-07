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
router.get('/:username/filter-name/:name', function(req, res, next){
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
			var contactArray = [];
			for(var i=0; i<user.contacts.length; i++){
				if(user.contacts[i].name === req.params.name){
					contactArray.push(user.contacts[i]);
				}
			}

			if(contactArray.length === 0){
				// If no contact, return 404.
				var err = new Error("Not found.");
				err.status = 404;
				return next(err);
			} else {
				return res.status(200).send({
					ok: true,
					message: "Contacts sent.",
					contacts: contactArray
				});
			}
		});
});

/* GET contact of user */
router.get('/:username/filter-tel/:telephone', function(req, res, next){
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
			var contactArray = [];
			for(var i=0; i<user.contacts.length; i++){
				if(user.contacts[i].telephone === req.params.telephone){
					contactArray.push(user.contacts[i]);
				}
			}

			if(contactArray.length === 0){
				// If no contact, return 404.
				var err = new Error("Not found.");
				err.status = 404;
				return next(err);
			} else {
				return res.status(200).send({
					ok: true,
					message: "Contacts sent.",
					contacts: contactArray
				});
			}

		});
});

/* GET contact of user */
router.get('/:username/filter-email/:email', function(req, res, next){
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
			var contactArray = [];
			for(var i=0; i<user.contacts.length; i++){
				if(user.contacts[i].email === req.params.email){
					contactArray.push(user.contacts[i]);
				}
			}

			if(contactArray.length === 0){
				// If no contact, return 404.
				var err = new Error("Not found.");
				err.status = 404;
				return next(err);
			} else {
				return res.status(200).send({
					ok: true,
					message: "Contacts sent.",
					contacts: contactArray
				});
			}	
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
router.put('/:username/filter-name/:name', function(req, res, next){
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
			var contact;
			for(var i=0; i<user.contacts.length; i++){
				if(user.contacts[i].name === req.params.name){
					contact = user.contacts[i];
				}
			}

			if(!contact){
				// If no contact, return 404.
				var err = new Error("Not found.");
				err.status = 404;
				return next(err);
			}
			
			Contact.update({_id: contact._id}, {$set: contact}, function(err){
				return res.status(200).send({
					ok: true,
					message: "Contact updated."
				});
			});
		});
});

/* PUT contact of user */
router.put('/:username/filter-tel/:telephone', function(req, res, next){
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
			var contact;
			for(var i=0; i<user.contacts.length; i++){
				if(user.contacts[i].telephone === req.params.telephone){
					contact = user.contacts[i];
				}
			}

			if(!contact){
				// If no contact, return 404.
				var err = new Error("Not found.");
				err.status = 404;
				return next(err);
			}
			
			Contact.update({_id: contact._id}, {$set: contact}, function(err){
				return res.status(200).send({
					ok: true,
					message: "Contact updated."
				});
			});
		});
});

/* PUT contact of user */
router.put('/:username/filter-email/:email', function(req, res, next){
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
			var contact;
			for(var i=0; i<user.contacts.length; i++){
				if(user.contacts[i].email === req.params.email){
					contact = user.contacts[i];
				}
			}

			if(!contact){
				// If no contact, return 404.
				var err = new Error("Not found.");
				err.status = 404;
				return next(err);
			}
			
			Contact.update({_id: contact._id}, {$set: contact}, function(err){
				return res.status(200).send({
					ok: true,
					message: "Contact updated."
				});
			});
		});
});

/* DELETE contact of user */
router.delete('/:username/filter-name/:name', function(req, res, next){
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

			var contact;
			for(var i=0; i<user.contacts.length; i++){
				if(user.contacts[i].name === req.params.name){
					contact = user.contacts[i];
				}
			}

			if(!contact){
				// If no contact, return 404.
				var err = new Error("Not found.");
				err.status = 404;
				return next(err);
			}

			Contact.remove({_id: contact._id}).exec();
			User.update({_id: user._id}, {$pull: { contacts: contact._id }}, function(err){
				return res.status(200).send({
					ok: true,
					message: "Contact deleted."
				});
			});
		});
});

/* DELETE contact of user */
router.delete('/:username/filter-tel/:telephone', function(req, res, next){
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
			var contact;
			for(var i=0; i<user.contacts.length; i++){
				if(user.contacts[i].telephone === req.params.telephone){
					contact = user.contacts[i];
				}
			}

			if(!contact){
				// If no contact, return 404.
				var err = new Error("Not found.");
				err.status = 404;
				return next(err);
			}

			Contact.remove({_id: contact._id}).exec();
			User.update({_id: user._id}, {$pull: { contacts: contact._id }}, function(err){
				return res.status(200).send({
					ok: true,
					message: "Contact deleted."
				});
			});
		});
});

/* DELETE contact of user */
router.delete('/:username/filter-email/:email', function(req, res, next){
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
			var contact;
			for(var i=0; i<user.contacts.length; i++){
				if(user.contacts[i].email === req.params.email){
					contact = user.contacts[i];
				}
			}

			if(!contact){
				// If no contact, return 404.
				var err = new Error("Not found.");
				err.status = 404;
				return next(err);
			}

			Contact.remove({_id: contact._id}).exec();
			User.update({_id: user._id}, {$pull: { contacts: contact._id }}, function(err){
				return res.status(200).send({
					ok: true,
					message: "Contact deleted."
				});
			});
		});
});

module.exports = router;