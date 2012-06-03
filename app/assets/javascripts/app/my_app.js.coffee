window.MyApp ||= Ember.Application.create


MyApp.student = Ember.Object.create 
	firstName: "",
	lastName: "",
	fullName: ( ->
		@get('firstName') + ' ' + @get('lastName')
	).property('firstName', 'lastName')	
MyApp.book = Ember.Object.create
	title: ""
	barrowersNameBinding: "MyApp.student.fullName"
