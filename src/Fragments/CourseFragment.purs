 
module Fragments.CourseFragment where

import Prelude (bind, ($), (<>), pure, discard)
import Control.Monad.Except.Trans (runExceptT)
import Utils
import Types.UITypes
import Types.APITypes
import UI



courseFragment input whereFrom whatToSendBack = do
	event <- ui $ MainActivity 
	case event of
		OPEN_CourseInfoActivity {course:output} -> courseInfoActivity output "CourseFragment" input
		OPEN_EnrolledCourseActivity {course:output} -> enrolledCourseActivity output "CourseFragment" input
		OPEN_SearchActivity {filterDetails : output} -> searchCourseActivity output "CourseFragment" input
		OPEN_CourseViewAllActivity {courseListDetails : output} -> courseViewAllActivity output "CourseFragment" input
		API_UserEnrolledCourse {user_token:x,api_token:y}-> do
			responseData <- getUserEnrolledCourses x y
	 		_ <- sendUpdatedState {response : responseData, responseFor : "API_UserEnrolledCourse", screen:"asas"}
	  		pure $ "apiDefault"
	  	API_FilterPage{user_token:user_token, api_token:api_key,filter_to_send:delta}  ->	do
			responseData <- getCourcePageFilterApi user_token api_key delta
			_ <- sendUpdatedState {response : responseData, responseFor : "API_FilterPage", screen:"asas"}
			pure $ "handled"	
		_ -> courseFragment input whereFrom whatToSendBack



courseViewAllActivity input whereFrom whatToSendBack = do
	event <- ui $ CourseViewAllActivity {courseViewAllDetails : input}
	case event of
		OPEN_EnrolledCourseFlowFromCourseViewAll {course:output} -> enrolledCourseActivity output "CourseViewAllActivity" input
		BACK_CourseViewAllActivity -> case whereFrom of
			"CourseFragment" -> courseFragment whatToSendBack "Terminate"  input
			_ -> courseFragment whatToSendBack "Terminate" input
		_ -> courseViewAllActivity input whereFrom whatToSendBack


courseInfoActivity input whereFrom whatToSendBack = do
	event <- ui $ CourseInfoActivity {courseDetails : input}
	case event of
		OPEN_EnrolledActivity {course: output} -> enrolledCourseActivity output "CourseFragment" input
		API_EnrollCourse {user_token : x, reqParams : details , api_token: token} -> do
				responseData <- enrollCourse x details token
	  			_ <- sendUpdatedState {response : responseData, responseFor : "API_EnrollCourse", screen:"asas"}
				pure $ "apiDefault"
		BACK_CourseInfoActivity -> case whereFrom of
			"CourseFragment" -> courseFragment whatToSendBack "Terminate" input
			"CourseViewAllActivity" -> courseViewAllActivity whatToSendBack "Terminate" input
			"SearchActivity" -> searchCourseActivity whatToSendBack "Terminate" input
			_ -> courseFragment whatToSendBack "Terminate" input
		_ -> courseInfoActivity input whereFrom whatToSendBack


enrolledCourseActivity input whereFrom whatToSendBack = do
	event <- ui $ CourseEnrolledActivity {courseDetails : input}
	case event of
  		OPEN_ModuleDetailsActivity {moduleName:output1,moduleDetails:output2} -> subModuleDetailActivity output1 output2 "EnrolledCourseActivity" input
  		BACK_CourseEnrolledActivity -> case whereFrom of
			"CourseFragment" -> courseFragment whatToSendBack "Terminate" input
			"SearchActivity" -> searchCourseActivity whatToSendBack "Terminate" input
			"CourseViewAllActivity" -> courseViewAllActivity whatToSendBack "Terminate" input
			_ -> courseFragment whatToSendBack "Terminate" input
		_ -> enrolledCourseActivity input whereFrom whatToSendBack


moduleDetailActivity mName input whereFrom whatToSendBack = do
	event <- ui $ ModuleDetailActivity {moduleName : mName,moduleDetails :input}
	case event of
		OPEN_AlternateModuleDetailActivity {moduleName:output1,moduleDetails:output2} -> subModuleDetailActivity output1 output2  "Terminate" input
		BACK_ModuleDetailActivity-> case whereFrom of
			"EnrolledCourseActivity" -> enrolledCourseActivity whatToSendBack "Terminate" input
			"Terminate" -> enrolledCourseActivity whatToSendBack "Terminate" input
			_ ->  courseFragment whatToSendBack "Terminate" input
  		_ -> moduleDetailActivity mName input whereFrom whatToSendBack


subModuleDetailActivity mName input whereFrom whatToSendBack = do
	event <- ui $ AlternateModuleDetailActivity {moduleName:mName,moduleDetails:input}
	case event of
		OPEN_ModuleActivity {moduleName: output1,moduleDetails: output2} -> moduleDetailActivity output1 output2 "Terminate" input
		BACK_AlternateModuleDetailActivity -> case whereFrom of
			"Misc" ->  moduleDetailActivity mName input whereFrom input
			"EnrolledCourseActivity" -> enrolledCourseActivity whatToSendBack "Terminate" input
			_ ->  enrolledCourseActivity whatToSendBack "Terminate" input
  		_ -> subModuleDetailActivity mName input whereFrom whatToSendBack


searchCourseActivity input whereFrom whatToSendBack = do
  event <- ui $ SearchActivity {filterDetails:input}
  case event of
    OPEN_CourseInfoActivity_SEARCH {course : output} -> courseInfoActivity output "SearchActivity" input
    OPEN_FilterActivity {filterDetails : output} -> courseFilterActivity output "SearchActivity" input
    BACK_SearchActivity -> case whereFrom of
		"CourseFragment" -> courseFragment whatToSendBack "Terminate" input
		_ -> courseFragment whatToSendBack "Terminate" input
    _ -> searchCourseActivity input whereFrom whatToSendBack


courseFilterActivity input whereFrom whatToSendBack = do
  event <- ui $ FilterActivity {filterDetails : input}
  case event of
    OPEN_SearchActivity_FILTER {filterData: output} -> searchCourseActivity output "Terminate" input
    BACK_FilterActivity -> case whereFrom of
    	"SearchActivity" -> searchCourseActivity input "Terminate" input
    	_ -> searchCourseActivity input "Terminate" input
    _ -> courseFilterActivity input whereFrom whatToSendBack


