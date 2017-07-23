
module Fragments.CourseFragment where

import Prelude (bind, ($), (<>), pure, discard)
import Control.Monad.Except.Trans (runExceptT)
import Utils
import Types.UITypes
import Types.APITypes
import UI



courseFragment input whereFrom whatToSendBack = do
	event <- ui $ HomeActivity 
	case event of
		OPEN_CourseInfoActivity {course:output} ->courseInfoActivity output "CourseFlow" input
		OPEN_EnrolledCourseActivity {course:output} -> enrolledCourseActivity output "CourseFragment" input
		OPEN_SearchActivity {filterDetails : output} -> searchCourseActivity output "CourseFragment" input
		OPEN_CourseViewAllActivity {courseListDetails : output} -> courseViewAllActivity output "CourseFragment" input
		API_UserEnrolledCourse {user_token:x,api_token:y}-> do
			responseData <- getUserEnrolledCourses x y
	 		_ <- sendUpdatedState {response : responseData, responseFor : "API_UserEnrolledCourse", screen:"asas"}
	  		pure $ "apiDefault"
		_ -> courseFragment input whereFrom whatToSendBack


courseViewAllActivity input whereFrom whatToSendBack = do
	event <- ui $ CourseViewAllActivity {courseViewAllDetails : input}
	case event of
		OPEN_EnrolledCourseFlowFromCourseView {course:output} -> startEnrolledCourseFlow output "CourseViewAll" input
		BACK_CourseViewAllActivity -> case whereFrom of
			"CourseFragment" -> courseFragment whatToSendBack "Terminate" 
			_ -> courseFragment whatToSendBack
		_ -> courseViewAllActivity input whereFrom whatToSendBack

courseInfoActivity input whereFrom whatToSendBack= do
	event <- ui $ CourseInfoActivity {courseDetails:input}
	case event of
		OPEN_EnrolledActivity {course:output} -> enrolledCoursActivity output "CourseFlow" input
		API_EnrollCourse {user_token:x,reqParams:details,api_token:token} -> do
			output <- enrollCourse x details token
  			_ <- sendUpdatedState {response : output, responseFor : "EnrollCourseApi", screen:"asas"}
			pure $ "apiDefault"
		BACK_CourseInfoActivity -> do
			case whereFrom of
				"CourseFlow" -> courseFragment whatToSendBack "Terminate" input
				"CourseViewAll" -> courseViewAllActivity whatToSendBack "Terminate" input
				"CourseSearch" -> courseSearchActivity whatToSendBack "Terminate" input
				_ -> courseFragment whatToSendBack input
		_ -> courseInfoActivity input whereFrom whatToSendBack 

enrolledCourseActivity input whereFrom whatToSendBack= do
	event <- ui $ CourseEnrolledActivity {courseDetails:input}
	case event of
  		OPEN_ModuleActivity {moduleName:output1,moduleDetails:output2}-> subModuleDetailActivity output1 output2 "EnrolledCourseActivity" input
  		BACK_CourseEnrolledActivity -> do
			case whereFrom of
				"CourseFlow" -> courseFragment whatToSendBack "Terminate" input
				"CourseViewAll" -> courseViewAllActivity whatToSendBack "Terminate" input
				_ -> courseFragment whatToSendBack "Terminate" input
		_ -> enrolledCourseActivity input whereFrom whatToSendBack

moduleDetailActivity mName input whereFrom whatToSendBack= do
	event <- ui $ ModuleDetailActivity {moduleName:mName,moduleDetails:input}
	case event of
		OPEN_SubModuleDetailActivity {moduleName:output1,moduleDetails:output2}-> subModuleDetailActivity output1 output2  "Terminate" input
		BACK_ModuleDetailActivity-> case whereFrom of
			"EnrolledCourseActivity" -> enrolledCourseActivity whatToSendBack "Terminate" input
			"Terminate" -> enrolledCourseActivity whatToSendBack "Terminate" input
			_ ->  courseFragment event
  		_ -> moduleDetailActivity mName input whereFrom whatToSendBack


subModuleDetailActivity mName input whereFrom whatToSendBack= do
	event <- ui $ AlternateModuleDetailActivity {moduleName:mName,moduleDetails:input}
	case event of
		OPEN_ModuleActivity {moduleName:output1,moduleDetails:output2}-> moduleDetailActivity output1 output2 "Terminate" input
		BACK_AlternateModuleDetailActivity -> case whereFrom of
			"Misc"->  moduleDetailActivity mName input whereFrom input
			"EnrolledCourseActivity" -> enrolledCourseActivity whatToSendBack "Terminate" input
			_ ->  enrolledCourseActivity whatToSendBack "Terminate" input
  		_ -> subModuleDetailActivity mName input whereFrom whatToSendBack

searchCourseActivity input whereFrom whatToSendBack = do
  event <- ui $ SearchActivity {filterDetails:input}
  case event of
    OPEN_CourseInfoActivity_SEARCH {course : output} -> courseInfoActivity output "CourseSearch" input
    OPEN_FilterActivity {filterDetails : output} -> searchCourseFilterActivity output "SearchCourseActivity" input
    BACK_SearchActivity -> case whereFrom of
		"CourseFragment" -> courseFragment whatToSendBack "Terminate" input
		_ -> courseFragment whatToSendBack "Terminate" input
    _ -> searchCourseActivity input whereFrom whatToSendBack

searchCourseFilterActivity input whereFrom whatToSendBack = do
  event <- ui $ FilterActivity {filterDetails : input}
  case event of
    OPEN_SearchActivity_FILTER {filterData: output} -> searchCourseActivity output "Terminate" input
    BACK_FilterActivity -> case whereFrom of
    	"SearchCourseActivity" -> searchCourseActivity input "Terminate" input
    	_ -> searchCourseActivity input "Terminate" input
    _ -> searchCourseFilterActivity input whereFrom whatToSendBack


