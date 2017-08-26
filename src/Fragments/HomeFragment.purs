
module Fragments.HomeFragment where


import Prelude (bind, ($), (<>), pure, discard)
import Utils
import Prelude
import Types.UITypes
import Types.APITypes
import UI



homeFragment input whereFrom whatToSendBack = do
	event <- ui $ MainActivity
	case event of
		OPEN_EnrolledCourseActivity {course:output} -> enrolledCourseActivity output "HomeFragment" input
		OPEN_SearchActivity {filterDetails : output} -> homeSearchActivity output "HomeFragment" input
		OPEN_CourseViewAllActivity {courseListDetails : output} -> courseViewAllActivity output "HomeFragment" input
		API_UserEnrolledCourse {user_token:x,api_token:y}-> do
			responseData <- getUserEnrolledCourses x y
	 		_ <- sendUpdatedState {response : responseData, responseFor : "API_UserEnrolledCourse", screen:"asas"}
	  		pure $ "apiDefault"
		API_Tenant {user_token:x, api_token:y, slug:z} -> do
			responseData <- getTenantDetail x y z
			_ <- sendUpdatedState {response : responseData, responseFor : "API_Tenant", screen:"asas"}
			pure $ "apiDefault"
		_ -> homeFragment input whereFrom whatToSendBack

homeSearchActivity input whereFrom whatToSendBack = do
	event <- ui $ SearchActivity {filterDetails:input}
	case event of
	    OPEN_CourseEnrolledActivity_SEARCH {course : output} -> enrolledCourseActivity output "HomeSearchActivity" input
	    OPEN_ResourceDetailActivity_SEARCH {resourceDetails : output} -> resourceDetailActivity output "HomeSearchActivity" input
	    OPEN_CourseInfoActivity_SEARCH {course : output} -> courseInfoActivity output "SearchActivity" input
	    OPEN_FilterActivity {filterDetails : output} -> filterActivity output "SearchActivity" input
	    BACK_SearchActivity -> case whereFrom of
	    	"HomeFragment" -> homeFragment whatToSendBack "Terminate" input
	    	_ -> homeFragment whatToSendBack "Terminate" input
	    _ -> homeSearchActivity input whereFrom whatToSendBack

filterActivity input whereFrom whatToSendBack = do
	event <- ui $ FilterActivity {filterDetails : input}
	case event of
		OPEN_SearchActivity_FILTER {filterData: output} -> homeSearchActivity output "FilterActivity" input
		BACK_FilterActivity -> homeSearchActivity whatToSendBack "HomeFragment" input
		_ -> filterActivity input whereFrom whatToSendBack

resourceDetailActivity input whereFrom whatToSendBack= do
	event <- ui $ ResourceDetailActivity {resourceDetails : input}
	case event of
		BACK_ResourceDetailActivity -> case whereFrom of
			"HomeSearchActivity" -> homeSearchActivity whatToSendBack "Terminate" input
			"HomeFragment" -> homeFragment whatToSendBack "Terminate" input
			_ -> homeFragment whatToSendBack "Terminate" input
		_ -> resourceDetailActivity input whereFrom whatToSendBack

courseViewAllActivity input whereFrom whatToSendBack = do
	event <- ui $ CourseViewAllActivity {courseViewAllDetails : input}
	case event of
		OPEN_EnrolledCourseFlowFromCourseViewAll {course:output} -> enrolledCourseActivity output "CourseViewAllActivity" input
		BACK_CourseViewAllActivity -> case whereFrom of
			"HomeFragment" -> homeFragment whatToSendBack "Terminate" input
			"SearchActivity" -> homeSearchActivity whatToSendBack "Terminate" input
			_ -> homeFragment whatToSendBack "Terminate" input
		_ -> courseViewAllActivity input whereFrom whatToSendBack

courseInfoActivity input whereFrom whatToSendBack= do
	event <- ui $ CourseInfoActivity {courseDetails:input}
	case event of
		OPEN_EnrolledActivity {course:output} -> enrolledCourseActivity output "HomeFragment" input
		OPEN_ViewBatchActivity {course: output}-> viewBatchActivity output "CourseInfoActivity" input
		API_EnrollCourse {user_token:x,reqParams:details,api_token:token} -> do
			output <- enrollCourse x details token
  			_ <- sendUpdatedState {response : output, responseFor : "EnrollCourseApi", screen:"asas"}
			pure $ "apiDefault"
		API_EnrolledCoursesList {user_token:x,api_token:y} -> do
	            responseData <- getUserEnrolledCourses x y
	            _ <- sendUpdatedState {response : responseData, responseFor : "API_EnrolledCoursesList", screen:"asas"}
	            pure $ "apiDefault"
		BACK_CourseInfoActivity -> do
			case whereFrom of
				"HomeFragment" -> homeFragment whatToSendBack "Terminate" input
				"CourseViewAllActivity" -> courseViewAllActivity whatToSendBack "Terminate" input
				"SearchActivity" -> homeSearchActivity whatToSendBack "Terminate" input
				_ -> homeFragment whatToSendBack "Terminate" input
		_ -> courseInfoActivity input whereFrom whatToSendBack

viewBatchActivity input whereFrom whatToSendBack = do
	event <- ui $ ViewBatchActivity {extras : input}
	case event of
		OPEN_EnrolledActivity_BATCH {course: output} -> enrolledCourseActivity output "HomeFragment" input
		API_Get_Batch_list {user_token : x, api_token: token , request : request } -> do
			responseData <- getBatchList x token request
			_ <- sendUpdatedState {response : responseData, responseFor : "API_Get_Batch_list", screen:"asas"}
			pure $ "apiDefault"
		API_BatchCreator {user_token:x, api_token:y} -> do
			resData <- getProfileDetail x y
			_<- sendUpdatedState {response : resData, responseFor : "API_BatchCreator", screen:"ViewBatchActivity"}
			pure $ "apiCalled"	
		API_EnrollInBatch {reqParams : details , user_token : x, api_token: token} -> do
			responseData <- enrollInBatch details x token
			_ <- sendUpdatedState {response : responseData, responseFor : "API_EnrollInBatch", screen:"asas"}
			pure $ "apiDefault"
		BACK_ViewBatchActivity -> case whereFrom of
			"CourseInfoActivity" -> courseInfoActivity whatToSendBack "Terminate" input
			"CourseViewAllActivity" -> courseViewAllActivity whatToSendBack "Terminate" input
			_ -> homeFragment whatToSendBack "Terminate" input
		_ -> viewBatchActivity input whereFrom whatToSendBack


enrolledCourseActivity input whereFrom whatToSendBack= do
	event <- ui $ CourseEnrolledActivity {courseDetails:input}
	case event of
		API_FlagCourse {user_token: user_token,api_token: api_token,requestBody:request,identifier:identifier} -> do
			responseData <- flagContent user_token api_token request identifier
			_ <- sendUpdatedState {response : responseData, responseFor : "API_FlagCourse", screen:"asas"}
			pure $ "handled"
		API_Get_Batch_Creator_name {user_token:user_token,api_token:api_token} -> do
			responseData <- getProfileDetail user_token api_token
			_ <- sendUpdatedState {response : responseData, responseFor : "API_Get_Batch_Creator_name", screen:"asas"}
			pure $ "handled"
		API_Get_Batch_Details {user_token : user_token,api_token : api_token ,batch_id : batch_id} -> do
			responseData <- getBatchDetails user_token api_token batch_id
			_ <- sendUpdatedState {response : responseData, responseFor : "API_Get_Batch_Details", screen:"asas"}
			pure $ "handled"
  		OPEN_ModuleDetailsActivity {moduleName:output1,moduleDetails:output2} -> subModuleDetailActivity output1 output2 "EnrolledCourseActivity" input
  		BACK_CourseEnrolledActivity -> do
			case whereFrom of
				"HomeSearchActivity" -> homeSearchActivity whatToSendBack "Terminate" input
				"CourseViewAllActivity" -> courseViewAllActivity whatToSendBack "Terminate" input
				_ -> homeFragment whatToSendBack "Terminate" input
		_ -> enrolledCourseActivity input whereFrom whatToSendBack


subModuleDetailActivity mName input whereFrom whatToSendBack= do
	event <- ui $ ModuleDetailActivity {moduleName:mName,moduleDetails:input}
	case event of
		BACK_ModuleDetailActivity -> case whereFrom of
			"Terminate"->  enrolledCourseActivity whatToSendBack "Terminate" input
			"EnrolledCourseActivity" -> enrolledCourseActivity whatToSendBack "Terminate" input
			_ ->  enrolledCourseActivity whatToSendBack "Terminate" input
  		_ -> subModuleDetailActivity mName input whereFrom whatToSendBack
