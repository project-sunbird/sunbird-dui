
module Fragments.HomeFragment where


import Prelude (bind, ($), (<>), pure, discard)
import Utils
import Prelude
import Types.UITypes
import Types.APITypes
import UI



homeFragment input whereFrom whatToSendBack = do
	event <- ui $ HomeActivity 
	case event of
		OPEN_EnrolledCourseActivity {course:output} -> enrolledCourseActivity output "HomeFragment" input
		OPEN_SearchActivity {filterDetails : output} -> homeSearchActivity output "HomeFragment" input
		OPEN_CourseViewAllActivity {courseListDetails : output} -> courseViewAllActivity output "HomeFragment" input
		API_UserEnrolledCourse {user_token:x,api_token:y}-> do
			responseData <- getUserEnrolledCourses x y
	 		_ <- sendUpdatedState {response : responseData, responseFor : "API_UserEnrolledCourse", screen:"asas"}
	  		pure $ "apiDefault"
		_ -> pure $ "HomeActivity"

homeSearchActivity input whereFrom whatToSendBack = do
	event <- ui $ SearchActivity {filterDetails:input}
	case event of
	    OPEN_ResourceDetailActivity_SEARCH {resourceDetails : output} -> resourceDetailActivity output "HomeSearchActivity" input
	    OPEN_CourseInfoActivity_SEARCH {course : output} -> courseInfoActivity output "HomeSearchActivity" input
	    OPEN_FilterActivity {filterDetails : output} -> filterActivity output "HomeSearchActivity" input
	    BACK_SearchActivity -> case whereFrom of
	    	"HomeFragment" -> homeFragment whatToSendBack "Terminate" input
	    	_ -> homeFragment whatToSendBack "Terminate" input
	    _ -> pure "SearchActivity"

filterActivity input whereFrom whatToSendBack = do
	event <- ui $ FilterActivity {filterDetails : input}
	case event of
		OPEN_SearchActivity_FILTER {filterData: output} -> homeSearchActivity output "FilterActivity" input
		_ -> pure "FilterActivity"

resourceDetailActivity input whereFrom whatToSendBack= do
	event <- ui $ ResourceDetailActivity {resourceDetails : input}
	case event of
		BACK_ResourceDetailActivity -> case whereFrom of
			"HomeSearchActivity" -> homeSearchActivity whereFrom "Terminate" input
			_ -> homeFragment whatToSendBack "Terminate" input
		_ -> pure $ "ResourceDetailActivity"
courseViewAllActivity input whereFrom whatToSendBack = do
	event <- ui $ CourseViewAllActivity {courseViewAllDetails : input}
	case event of
		OPEN_EnrolledCourseFlowFromCourseViewAll {course:output} -> enrolledCourseActivity output "CourseViewAll" input
		BACK_CourseViewAllActivity -> case whereFrom of
			"HomeFragment" -> homeFragment whatToSendBack "Terminate" input
			_ -> homeFragment whatToSendBack "Terminate" input
		_ -> pure $ "CourseViewAllActivity"		

courseInfoActivity input whereFrom whatToSendBack= do
	event <- ui $ CourseInfoActivity {courseDetails:input}
	case event of
		OPEN_EnrolledActivity {course:output} -> enrolledCourseActivity output "HomeFragment" input
		API_EnrollCourse {user_token:x,reqParams:details,api_token:token} -> do
			output <- enrollCourse x details token
  			_ <- sendUpdatedState {response : output, responseFor : "EnrollCourseApi", screen:"asas"}
			pure $ "apiDefault"
		BACK_CourseInfoActivity -> do
			case whereFrom of
				"HomeFragment" -> homeFragment whatToSendBack "Terminate" input
				"CourseViewAll" -> courseViewAllActivity whatToSendBack "Terminate" input
				"HomeSearch" -> homeSearchActivity whatToSendBack "Terminate" input
				_ -> homeFragment whatToSendBack "Terminate" input
		_ -> pure $ "CourseInfoActivity"

enrolledCourseActivity input whereFrom whatToSendBack= do
	event <- ui $ CourseEnrolledActivity {courseDetails:input}
	case event of
  		OPEN_ModuleDetailsActivity {moduleName:output1,moduleDetails:output2} -> subModuleDetailActivity output1 output2 "EnrolledCourseActivity" input
  		BACK_CourseEnrolledActivity -> do
			case whereFrom of
				"CourseViewAll" -> courseViewAllActivity whatToSendBack "Terminate" input
				_ -> homeFragment whatToSendBack "Terminate" input
		_ -> pure $ "CourseEnrolledActivity"

moduleDetailActivity mName input whereFrom whatToSendBack= do
	event <- ui $ ModuleDetailActivity {moduleName:mName,moduleDetails:input}
	case event of
		OPEN_AlternateModuleDetailActivity {moduleName:output1,moduleDetails:output2} -> subModuleDetailActivity output1 output2  "Terminate" input
		BACK_ModuleDetailActivity -> case whereFrom of
			"EnrolledCourseActivity" -> enrolledCourseActivity whatToSendBack "Terminate" input
			"Terminate" -> enrolledCourseActivity whatToSendBack "Terminate" input
			_ ->  enrolledCourseActivity whatToSendBack "Terminate" input
  		_ -> pure $ "ModuleDetailActivity"


subModuleDetailActivity mName input whereFrom whatToSendBack= do
	event <- ui $ AlternateModuleDetailActivity {moduleName:mName,moduleDetails:input}
	case event of
		OPEN_ModuleActivity {moduleName:output1,moduleDetails:output2} -> moduleDetailActivity output1 output2 "Terminate" input
		BACK_AlternateModuleDetailActivity -> case whereFrom of
			"Terminate"->  enrolledCourseActivity whatToSendBack "Terminate" input
			"EnrolledCourseActivity" -> enrolledCourseActivity whatToSendBack "Terminate" input
			_ ->  enrolledCourseActivity whatToSendBack "Terminate" input
  		_ -> pure $ "AlternateModuleDetailActivity"



