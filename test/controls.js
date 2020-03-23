module.exports = {
	user:{
		get:(context,users,next,$)=>{
			return next(users.filter((user)=>{
				IF(user.eq(context.user),()=>{
					return true
				})
				return user.memberships.find((mb)=>{
					return context.user.memberships.find((cmb)=>{
						return cmb.group.eq(mb.group);
					})
				})
			}))
		}
	},
	group:(()=>{
			var check = (context,group,$)=>{
				var admin = context.user.memberships.find(
					(mb)=>mb.group.eq({name:'admin'})
				);
				IF(admin.eq(null),()=>{
					$.THROW(new VError(['Cannot access group ',group.name]))
				})
			}
			return {
				add:(context,groups,next,$)=>{
					return next(groups.forEach((group)=>{
						check(context,group,$);
						group.owner = context.user
					}));
				},
				update:(context,groups,next,$)=>{
					return next(groups.forEach((group)=>{
						check(context,group,$);
						delete group.owner
					}));
				},
				remove:(context,groups,next,$)=>{
					return next(groups.forEach((group)=>{
						check(context,group,$);
					}));
				},
			}
		})(),
		membership:(()=>{
			var check = (scope,memberships,next,$)=>{
				return next(memberships.forEach((mb)=>{				
					IF(NOT(mb.group.owner.eq(scope.user)),()=>{
						$.THROW(new VError())
					})
				}))
			} 
			return {
				add:check,
				update:(context,memberships, $)=>{
					throw new Error("Cannot update memberships");
				},
				remove:check,
				get:(context,memberships,next,$)=>{
					return next(memberships.filter((membership)=>{
						IF(membership.user.eq(context.user),()=>{
							return true;
						})	
						return membership.group.memberships.find(
							(mb)=>mb.user.eq(context.user)
						)
					}))
				}
			}
		})()
}