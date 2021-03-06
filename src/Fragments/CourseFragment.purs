
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
		API_CourseFragment {user_token:x,api_token:y}-> do
			responseData <- getCoursesPageApi x y
			_ <- sendUpdatedState {response : responseData, responseFor : "API_CourseFragment", screen:"CourseFragment"}
			pure $ "handled"
		API_UserEnrolledCourse {user_token:x,api_token:y}-> do
			responseData <- getUserEnrolledCourses x y
	 		_ <- sendUpdatedState {response : responseData, responseFor : "API_UserEnrolledCourse", screen:"CourseFragment"}
	  		pure $ "apiDefault"
		API_FilterPage{user_token:user_token, api_token:api_key,filter_to_send:delta}  ->	do
			responseData <- getCourcePageFilterApi user_token api_key delta
			_ <- sendUpdatedState {response : responseData, responseFor : "API_FilterPage", screen:"CourseFragment" , filter_to_send:delta }
			pure $ "handled"
		_ -> courseFragment input whereFrom whatToSendBack


viewBatchActivity input whereFrom whatToSendBack = do
	event <- ui $ ViewBatchActivity {extras : input}
	case event of
		OPEN_EnrolledActivity_BATCH {course: output} -> enrolledCourseActivity output "CourseFragment" input
		API_BatchCreator {user_token:x, api_token:y} -> do
			resData <- getUserDetail x y
			_<- sendUpdatedState {response : resData, responseFor : "API_BatchCreator", screen:"ViewBatchActivity"}
			pure $ "apiCalled"
		API_Get_Batch_list {user_token : x, api_token: token , request : request } -> do
			responseData <- getBatchList x token request
			_ <- sendUpdatedState {response : responseData, responseFor : "API_Get_Batch_list", screen:"asas"}
			pure $ "apiDefault"
		API_EnrollInBatch {reqParams : details , user_token : x, api_token: token} -> do
			responseData <- enrollInBatch details x token
			_ <- sendUpdatedState {response : responseData, responseFor : "API_EnrollInBatch", screen:"asas"}
			pure $ "apiDefault"
		BACK_ViewBatchActivity -> case whereFrom of
			"CourseInfoActivity" -> courseInfoActivity whatToSendBack "Terminate" input
			"CourseViewAllActivity" -> courseViewAllActivity whatToSendBack "Terminate" input
			_ -> courseFragment whatToSendBack "Terminate" input
		_ -> viewBatchActivity input whereFrom whatToSendBack


courseViewAllActivity input whereFrom whatToSendBack = do
	event <- ui $ CourseViewAllActivity {courseViewAllDetails : input}
	case event of
		OPEN_EnrolledCourseFlowFromCourseViewAll {course:output} -> enrolledCourseActivity output "CourseViewAllActivity" input
		OPEN_CourseInfoFlowFromCourseViewAll {course:output} -> courseInfoActivity output "CourseViewAllActivity" input
		BACK_CourseViewAllActivity -> case whereFrom of
			"CourseFragment" -> courseFragment whatToSendBack "Terminate"  input
			_ -> courseFragment whatToSendBack "Terminate" input
		_ -> courseViewAllActivity input whereFrom whatToSendBack


courseInfoActivity input whereFrom whatToSendBack = do
	event <- ui $ CourseInfoActivity {courseDetails : input}
	case event of
		OPEN_ViewBatchActivity {course: output}-> viewBatchActivity output "CourseInfoActivity" input
		OPEN_EnrolledActivity {course: output} -> enrolledCourseActivity output "CourseFragment" input
		API_EnrolledCoursesList {user_token:x,api_token:y} -> do
	            responseData <- getUserEnrolledCourses x y
	            _ <- sendUpdatedState {response : responseData, responseFor : "API_EnrolledCoursesList", screen:"asas"}
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
		API_FlagCourse {user_token: user_token,api_token: api_token,requestBody:request,identifier:identifier} -> do
			responseData <- flagContent user_token api_token request identifier
			_ <- sendUpdatedState {response : responseData, responseFor : "API_FlagCourse", screen:"asas"}
			pure $ "handled"
		API_Get_Batch_Creator_name {user_token:user_token,api_token:api_token} -> do
			responseData <- getUserDetail user_token api_token
			_ <- sendUpdatedState {response : responseData, responseFor : "API_Get_Batch_Creator_name", screen:"asas"}
			pure $ "handled"
		API_Get_Batch_Details {user_token : user_token,api_token : api_token ,batch_id : batch_id} -> do
			responseData <- getBatchDetails user_token api_token batch_id
			_ <- sendUpdatedState {response : responseData, responseFor : "API_Get_Batch_Details", screen:"asas"}
			pure $ "handled"
  		OPEN_ModuleDetailsActivity {moduleName:output1,moduleDetails:output2} -> subModuleDetailActivity output1 output2 "EnrolledCourseActivity" input
  		BACK_CourseEnrolledActivity -> case whereFrom of
			"CourseFragment" -> courseFragment whatToSendBack "Terminate" input
			"SearchActivity" -> searchCourseActivity whatToSendBack "Terminate" input
			"CourseViewAllActivity" -> courseViewAllActivity whatToSendBack "Terminate" input
			_ -> courseFragment whatToSendBack "Terminate" input
		_ -> enrolledCourseActivity input whereFrom whatToSendBack


subModuleDetailActivity mName input whereFrom whatToSendBack = do
	event <- ui $ ModuleDetailActivity {moduleName:mName,moduleDetails:input}
	case event of
		BACK_ModuleDetailActivity -> case whereFrom of
			"Misc" ->  subModuleDetailActivity mName input whereFrom input
			"EnrolledCourseActivity" -> enrolledCourseActivity whatToSendBack "Terminate" input
			_ ->  enrolledCourseActivity whatToSendBack "Terminate" input
  		_ -> subModuleDetailActivity mName input whereFrom whatToSendBack


searchCourseActivity input whereFrom whatToSendBack = do
  event <- ui $ SearchActivity {filterDetails:input}
  case event of
    OPEN_CourseEnrolledActivity_SEARCH {course : output} -> enrolledCourseActivity output "SearchActivity" input
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
