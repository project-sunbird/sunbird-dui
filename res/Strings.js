const objectAssign = require('object-assign');
const stringsRes = {
	"en_US" : {
		SPLASH_MESSAGE : "Project Sunbird",
		WELCOME_M1 : "Welcome to Sunbird",
		WELCOME_M2 : "Structured education for the educators",
		WELCOME_BACK : "WELCOME BACK %s",
		WELCOME_ON_BOARD : "Welcome to Sunbird, %s ",
		FIRST_NAME : "NAME",
		FIRST_NAME_HINT : "Enter your name",
		EMAIL_ID : "EMAIL ID",
		HINT_EMAIL_ID : "sample@test.com",
		USER_NAME : "USER NAME",
		HINT_USER_NAME : "Enter user name",
		PASSWORD : "PASSWORD",
		HINT_PASSWORD : "Minimum 8 character password",
		MOBILE_NUMBER : "MOBILE NUMBER",
		HINT_MOBILE_NUMBER : "Enter mobile number",
		LANGUAGE : "LANGUAGE",
		HINT_LANGUAGE : "Choose preffered language",
		SIGN_IN : "SIGN IN",
		SIGN_UP : "SIGN UP",
		ALREADY_HAVE_ACC : "Already have an Account? Sign in now",
		NO_ACC_YET : "No Account yet? Sign up now",
		FORGOT_PASSWORD : "FORGOT PASSWORD?",
		BACK_TO_EXIT : "Press back again to exit app",
		INTERNET_ISSUE : "INTERNET CONNECTION ISSUE",
		ERROR_SERVER_CONNECTION : "Unable to connect to server",
		NO_INTERNET : "No internet connectivity",
		SEARCH_LOADING_MESSAGE : "Loading Search Results Please Wait......",
		EMPTY_SEARCH_RESULTS : "No Search Results Found",
		SIGN_UP_SUCCESS : "Sign Up Completed",
		RETRY_ACTION : "Please retry",
		ERROR_EMPTY_FIRSTNAME : "Please enter the first name",
		ERROR_EMPTY_USERNAME : "Please enter the user name",
		ERROR_EMPTY_EMAIL : "Please enter the email",
		ERROR_EMAIL_FORMAT : "Email format not correct",
		ERROR_EMPTY_PASSWORD : "Please enter the password",
		ERROR_SHORT_PASSWORD : "Password can't be shorter than 8 charecters",
		ERROR_EMPTY_MOBILE : "Please enter the mobile number",
		ERROR_SHORT_MOBILE : "Please check the mobile number format",
		ERROR_EMPTY_LANGUAGE : "Please choose atleast one language",
		ERROR_INPUT_FORM : "Please check your inputs",
		ERROR_INVALID_EMAIL : "Invalid email id",
		FORGOT_PASSWORD : "FORGOT PASSWORD?",
		SIGN_UP_SUCCESS : "Sign Up Completed",
		WELCOME : "Welcome",
		SAVED_RESOURCES : "Saved Resources",
		RESOURCES_LW : "Resources",
		RESOURCES_BNAV : "RESOURCES",
		HOME_BNAV : "HOME",
		COURSES_BNAV : "COURSES",
		GROUPS_BNAV : "GROUPS",
		PROFILE_BNAV : "PROFILE",
		SORT_BY : "SORT BY",
		WELCOME : "WELCOME",
		OPEN : "OPEN",
		RESUME : "RESUME",
		ENROLL_COURSE : "ENROLL FOR THIS COURSE",
		DOWNLOAD_RESOURCE : "DOWNLOAD THIS RESOURCE",
		ABOUT_MODULE : "ABOUT THIS MODULE",
		ERROR_EMPTY_PREVIEWS : "PREVIEWS",
		NO_PREVIEW : "No preview available",
		CREATED_BY : "CREATED BY",
		DOWNLOADS : "downloads",
		PLAY : "PLAY",
		JOIN : "JOIN",
		SEARCH_HINT : "Search",
		COMMUNITIES : "Communities",
		VIEW_ALL_COMMUNITIES : "Viewing all communities you’re a part of",
		DOWNLOAD : "DOWNLOAD",
		COURSE_ENROLLED : "Course enrolled",
		DESCRIPTION : "Description",
		QUIZ : "QUIZ",
		ASSIGNMENT : "ASSIGNMENT",
		PUBLISHED_DATE : "Published date",
		TO_DO : "To-Do",
		RECOMMENDED : "Recommended",
		VIEW_ALL : "VIEW ALL",
		COURSE : "COURSE",
		WAIT_REQUEST : "Please Wait ...",
		NO_RATING : "Unrated",
		NO_VOTES : "No votes yet",
		POPULAR_COURSES : "Popular Courses",
		COURSES_IN_PROGRESS : "Courses In Progress",
		LATEST_COURSES : "Latest Courses",
		NO_OFFLINE_RESOURCES : "No offline resources yet",
		COMING_SOON : "Coming soon..",
		YOUR_PROGRESS : "Your Progress",
		MODULE_SIZE : "Module Size",
		MORE : "more",
		FILTER_BY : "FILTER BY",
		SORT_BY : "SORT BY",
		FILTER : "Filter",
		APPLY_FILTER : "APPLY FILTER",
		STAR_RATINGS : "Star ratings",
		NUMBER_OF_VOTES : "Number of votes",
		PUBLISHED_DATE : "Published date",
		CHOOSE_TITLE : "Choose from the following",
		CONFIRM : "Confirm",
		REMAINING : "remaining",
		DONE : "done",
		VOTES : "Votes",
		SAVED_ON : "Saved on",
		LANGUAGES : "LANGUAGES",
		PHONE : "PHONE",
		PROFILE_DETAILS_TITLE : "Profile Details",
		COMING_SOON : "More details coming soon ..",
		SERVER_CONNECTION_ERROR : "Unable to connect to server",
	},
	"hi_IN" : {
	},
	"ta_IN" : {
	},
	"te_IN" : {
	},
	"bn_IN" : {
	},
	"ml_IN" : {
	},
	"or_IN" : {
	},
	"gu_IN" : {
	},
	"kn_IN" : {
	},
	"as_IN" : {
	},
	"mr_IN" : {
	},
	"pa_IN" : {
	},
	"ur_IN" : {
	},
}

var decideString = function(){
	var val = window.__CurrentLanguage;
	var merged = {};
	return objectAssign({},merged,stringsRes["en_US"],stringsRes[val]);
}


var setLanguage = function(lang){
	window.__CurrentLanguage = lang;
	JBridge.setKey("languagePref",lang);
}


exports.setLanguage = setLanguage;
exports.strings = decideString;
exports.stringsRes = stringsRes;
