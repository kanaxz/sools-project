const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const VError = require("sools/virtualizing/Virtual/enum/Error");
const Array = require("sools/virtualizing/Virtual/enum/Array")
const DynamicObject = require("sools/virtualizing/Virtual/enum/DynamicObject")
const constantes = require("./constantes");
const Virtuals = require("sools/data/virtualizing/Virtual/enum");

function validate(models, fields, $) {
  fields = $(fields);
  FORIN(fields, (fieldName) => {
    LOG(fieldName)
    var field = CAST(DynamicObject, GET(fields, fieldName));
    debugger
    IF(field.disable, () => {
      models.forEach((model) => {
        DELETE(model, fieldName)
      })
    })
    IF(field.required, () => {
      /*
      var failed = models.reduce((failed,model)=>{
      	IF(GET(model,fieldName).eq(null),()=>{
      		failed.push(model)
      	})
      	return failed;
      },new (Array.of(models.template)))
      IF(failed.length(),()=>{
      	$.THROW({message:''})
      })
      /**/
    })
    IF(field.unique, () => {

    })
    /**/
  })
}

module.exports = {
	clans:{

	},
  clanMap: {
    properties: {
      ressources: {
        push: ({ db, constantes }, ressources, $) => {
          return db.ressources.push(ressources.forEach((ressource) => {
            delete ressource._id;

            IF(OR(ressource.level.lt(0), ressource.level.gt(100)), () => {
              $.THROW({ message: 'Level must be between 0 and 100' })
            })

            IF(constantes.ressourceTypes.indexOf(ressource.type).eq(-1), () => {
              $.THROW({ message: 'Invalide ressource type' })
            })
            IF(NOT(ressource.map.eq(null)), () => {
              ressource.map.load();
            })
            IF(ressource.map.eq(null), () => {
              $.THROW({ message: 'Map required' })
            })
            IF(ressource.position.eq(null), () => {
              $.THROW({ message: 'Position required' })
            })
            IF(OR(ressource.position.x.gt(constantes.mapSize), ressource.position.x.lt(constantes.mapSize.multiply(-1)),
              ressource.position.y.gt(constantes.mapSize), ressource.position.y.lt(constantes.mapSize.multiply(-1))), () => {
              $.THROW({ message: 'Position out of bounds' })
            })

            /**/
          }))
        }
      }
    }
  },
  user: {
    get: (context, users, $) => {
      IF(context.user.eq(null), () => {
        $.THROW({ message: 'cannot get users' })
      })
      return next(users.filter((user) => {
        delete user.password
        user.load({
          memberships: true
        })
        IF(user.eq(context.user), () => {
          return true
        })
        return user.memberships.find((mb) => {
          return context.user.memberships.find((cmb) => {
            return cmb.group.eq(mb.group);
          })
        })
      }))
    },
    add: (context, users, next, $) => {
      IF(context.user, () => {
        var adminGroup = context.user.memberships.find((mb) => {
          return mb.group.name.eq("admin")
        })
        IF(adminGroup.eq(null), () => {
          $.THROW({ message: 'Must be an admin to add users' })
        })
      })
      ELSEIF(NOT(users.length().eq(1)), () => {
        $.THROW({ message: 'Cannot add multiples users when logged off' })
      })
      //return next(users);
      /*
      validate(users,{
      	email:{
      		required:true,
      		match:emailRegex,
      		unique:true
      	},
      	name:{
      		required:true
      	}
      },$)
      /**/
      return next(users.forEach((user) => {
        delete user._id
      }))
    },
    update: (context, users, next) => {
      return next(users.filter((user) => {
        var isAdmin = context.user.memberships.find((mb) => {
          return mb.group.name.eq("admin")
        })
        return OR(isAdmin, user.eq(context.user))
      }).forEach((user) => {
        user.load({
          memberships: {
            group: true
          }
        })
      }), (user, save) => {
        IF(NOT(user.eq(context.user)), () => {
          DELETE(user.password)
        })
        user.password = encrypt(password);
        save()
      })
    },
    delete: () => {
      throw new Error()
    }
  },
  group: (() => {
    var check = (context, group, $) => {
      var admin = context.user.memberships.find(
        (mb) => mb.group.eq({ name: 'admin' })
      );
      IF(admin.eq(null), () => {
        $.THROW(new VError(['Cannot access group ', group.name]))
      })
    }
    return {
      add: (context, groups, next, $) => {
        return next(groups.forEach((group) => {
          check(context, group, $);
          group.owner = context.user
        }));
      },
      update: {
        filter: (context, users, next) => {

        },
        validate: (context, user, next) => {

        }
      },
      remove: (context, groups, next, $) => {
        return next(groups.forEach((group) => {
          check(context, group, $);
        }));
      },
    }
  })(),
  membership: (() => {
    var check = (context, memberships, next, $) => {
      return next(memberships)
      return next(memberships.forEach((mb) => {
        IF(NOT(mb.group.owner.eq(context.user)), () => {
          $.THROW(new VError())
        })
      }))
    }
    return {
      add: check,
      update: (context, memberships, $) => {
        throw new Error("Cannot update memberships");
      },
      remove: check,
      get: (context, memberships, next, $) => {
        return next(memberships.filter((membership) => {
          IF(membership.user.eq(context.user), () => {
            return true;
          })
          membership.load({
            group: {
              memberships: true
            }
          })
          return membership.group.memberships.find(
            (mb) => mb.user.eq(context.user)
          )
        }))
      }
    }
  })()
}