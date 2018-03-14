
module Fragments.ResourceFragment where

import Prelude (bind, ($), (<>), pure, discard)
import Utils
import Prelude
import Types.UITypes
import Types.APITypes
import UI
import Control.Monad.Eff.Class(liftEff)
import Control.Monad.Aff.Console



resourceFragment input whereFrom whatToSendBack = do
	event <- ui $ MainActivity
	case event of
		OPEN_ResourceDetailActivity {resourceDetails:output} -> resourceDetailActivity output "ResourceFlow" input
		OPEN_ResourceViewAllActivity {resourceDetails:output} -> resourceViewAllActivity output "ResourceFragmnet" input
		OPEN_EnrolledCourseActivity {course:output} -> courseDetailActivity output "ResourceFragmnet" input
		OPEN_SearchActivity {filterDetails: output} -> resourceSearchActivity output "ResourceFragmnet" input
		OPEN_CourseInfoActivity {course : output} -> courseDetailActivity output "ResourceFragmnet" input
		OPEN_QRActivity -> qrActivity "ResourceFragmnet" input
		API_ResourceFragment {user_token:x,api_token:y}-> do
			responseData <- getResourcePageApi x y
			_ <- sendUpdatedState {response : responseData, responseFor : "API_ResourceFragment", screen:"ResourceFragment"}
			pure $ "handled"
		API_FilterPage{user_token:user_token, api_token:api_key,filter_to_send:delta}  ->	do
			responseData <- getResourcePageFilterApi user_token api_key delta
			_ <- sendUpdatedState {response : responseData, responseFor : "API_FilterPage", screen:"ResourceFragment", filter_to_send:delta}
			pure $ "handled"
		_ -> resourceFragment input whereFrom whatToSendBack


resourceSearchActivity input whereFrom whatToSendBack = do
	event <- ui $ SearchActivity {filterDetails:input}
	case event of
	    OPEN_ResourceDetailActivity_SEARCH {resourceDetails : output} -> resourceDetailActivity output "SearchActivity" input
	    OPEN_FilterActivity {filterDetails : output} -> filterActivity output "SearchActivity" input
	    OPEN_CourseEnrolledActivity_SEARCH {course : output} -> courseDetailActivity output "SearchActivity" input

	    BACK_SearchActivity -> case whereFrom of
	    	"ResourceFragmnet" -> resourceFragment whatToSendBack whereFrom input
	    	_ -> resourceFragment whatToSendBack whereFrom input
	    _ -> resourceSearchActivity input whereFrom whatToSendBack


filterActivity input whereFrom whatToSendBack = do
	event <- ui $ FilterActivity {filterDetails : input}
	case event of
		OPEN_SearchActivity_FILTER {filterData: output} -> resourceSearchActivity output "Terminate" input
		BACK_FilterActivity -> case whereFrom of
			"SearchScreen" -> resourceSearchActivity whatToSendBack "Terminate" input
			_ -> resourceSearchActivity whatToSendBack "FilterActivity" input
		_ -> filterActivity input whereFrom whatToSendBack


resourceDetailActivity input whereFrom whatToSendBack = do
	event <- ui $ ResourceDetailActivity {resourceDetails : input}
	case event of
		API_FlagContent{user_token: user_token,api_token: api_token,requestBody:request,identifier:identifier} -> do
			responseData <- flagContent user_token api_token request identifier
			_ <- sendUpdatedState {response : responseData, responseFor : "API_FlagContent", screen:"asas"}
			pure $ "handled"
		BACK_ResourceDetailActivity -> case whereFrom of
			"ResourceViewAllAcitivity" -> resourceViewAllActivity whatToSendBack "Terminate" input
			"SearchActivity" -> resourceSearchActivity whatToSendBack "Terminate" input
			"ResourceFragment" -> resourceFragment whatToSendBack "Terminate" input
			_ -> resourceFragment whatToSendBack "Terminate" input
		_ -> resourceDetailActivity input whereFrom whatToSendBack

courseDetailActivity input whereFrom whatToSendBack = do
	event <- ui $ CourseEnrolledActivity {courseDetails: input}
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
		OPEN_ModuleDetailsActivity {moduleName : output1 , moduleDetails : output2} -> subModuleResourceDetailActivity output1 output2 "CourseEnrolledActivity" input
		BACK_CourseEnrolledActivity -> case whereFrom of
			"ResourceActivity" -> resourceSearchActivity whatToSendBack "Terminate" input
			"SearchActivity" -> resourceSearchActivity whatToSendBack "Terminate" input

			_ -> resourceFragment whatToSendBack whereFrom input
		_ -> courseDetailActivity input whereFrom whatToSendBack

subModuleResourceDetailActivity mName input whereFrom whatToSendBack = do
	event <- ui $ ModuleDetailActivity {moduleName:mName,moduleDetails:input}
	case event of
		BACK_ModuleDetailActivity -> case whereFrom of
			"Terminate"->  courseDetailActivity whatToSendBack "Terminate" input
			"CourseEnrolledActivity" -> courseDetailActivity whatToSendBack "Terminate" input
			_ ->  courseDetailActivity whatToSendBack "Terminate" input
  		_ -> subModuleResourceDetailActivity mName input whereFrom whatToSendBack


resourceViewAllActivity input whereFrom whatToSendBack = do
	event <- ui $ ResourceViewAllActivity {resourceDetails : input}
	case event of
		OPEN_ResourceInfo { resourceDetails : output} -> resourceDetailActivity output "ResourceViewAllAcitivity" input
		OPEN_CourseEnrolled { course : output2 } -> courseDetailActivity output2 "ResourceViewAllAcitivity" input
		BACK_ResourceViewAllActivity -> case whereFrom of
			"ResourceFragmnet" -> resourceFragment whatToSendBack "Terminate" input
			_ -> resourceFragment whatToSendBack "Terminate" input
		_ -> resourceViewAllActivity input whereFrom whatToSendBack

qrActivity whereFrom whatToSendBack = do
 event <- ui $ QRActivity
 case event of
  OPEN_CourseEnrolledActivity_QR {course : output} -> enrolledCourseActivity output "ResourceFragment" whatToSendBack
  OPEN_ResourceDetailActivity_QR {resourceDetails : output} -> resourceDetailActivity output "ResourceFragment" whatToSendBack
  OPEN_CourseInfoActivity_QR {course : output} -> courseInfoActivity output "ResourceFragment" whatToSendBack
  OPEN_SearchActivity_QR {filterDetails : output} -> resourceSearchActivity output "ResourceFragment" whatToSendBack
  BACK_QRActivity -> resourceFragment whatToSendBack "Terminate" whatToSendBack
  _ -> resourceFragment whatToSendBack "Terminate" whatToSendBack

enrolledCourseActivity input whereFrom whatToSendBack= do
	event <- ui $ CourseEnrolledActivity {courseDetails:input}
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
  		BACK_CourseEnrolledActivity -> do
			case whereFrom of
				"ResourceSearchActivity" -> resourceSearchActivity whatToSendBack "Terminate" input
				"CourseViewAllActivity" -> courseViewAllActivity whatToSendBack "Terminate" input
				_ -> resourceFragment whatToSendBack "Terminate" input
		_ -> enrolledCourseActivity input whereFrom whatToSendBack

courseInfoActivity input whereFrom whatToSendBack= do
	event <- ui $ CourseInfoActivity {courseDetails:input}
	case event of
		OPEN_EnrolledActivity {course:output} -> enrolledCourseActivity output "ResourceFragment" input
		OPEN_ViewBatchActivity {course: output}-> viewBatchActivity output "CourseInfoActivity" input
		API_EnrolledCoursesList {user_token:x,api_token:y} -> do
	            responseData <- getUserEnrolledCourses x y
	            _ <- sendUpdatedState {response : responseData, responseFor : "API_EnrolledCoursesList", screen:"asas"}
	            pure $ "apiDefault"
		BACK_CourseInfoActivity -> do
			case whereFrom of
				"ResourceFragment" -> resourceFragment whatToSendBack "Terminate" input
				"CourseViewAllActivity" -> courseViewAllActivity whatToSendBack "Terminate" input
				"SearchActivity" -> resourceSearchActivity whatToSendBack "Terminate" input
				_ -> resourceFragment whatToSendBack "Terminate" input
		_ -> courseInfoActivity input whereFrom whatToSendBack

subModuleDetailActivity mName input whereFrom whatToSendBack= do
	event <- ui $ ModuleDetailActivity {moduleName:mName,moduleDetails:input}
	case event of
		BACK_ModuleDetailActivity -> case whereFrom of
			"Terminate"->  enrolledCourseActivity whatToSendBack "Terminate" input
			"EnrolledCourseActivity" -> enrolledCourseActivity whatToSendBack "Terminate" input
			_ ->  enrolledCourseActivity whatToSendBack "Terminate" input
  		_ -> subModuleDetailActivity mName input whereFrom whatToSendBack

courseViewAllActivity input whereFrom whatToSendBack = do
	event <- ui $ CourseViewAllActivity {courseViewAllDetails : input}
	case event of
		OPEN_EnrolledCourseFlowFromCourseViewAll {course:output} -> enrolledCourseActivity output "CourseViewAllActivity" input
		BACK_CourseViewAllActivity -> case whereFrom of
			"ResourceFragment" -> resourceFragment whatToSendBack "Terminate" input
			"SearchActivity" -> resourceSearchActivity whatToSendBack "Terminate" input
			_ -> resourceFragment whatToSendBack "Terminate" input
		_ -> courseViewAllActivity input whereFrom whatToSendBack

viewBatchActivity input whereFrom whatToSendBack = do
	event <- ui $ ViewBatchActivity {extras : input}
	case event of
		OPEN_EnrolledActivity_BATCH {course: output} -> enrolledCourseActivity output "ResourceFragment" input
		API_Get_Batch_list {user_token : x, api_token: token , request : request } -> do
			responseData <- getBatchList x token request
			_ <- sendUpdatedState {response : responseData, responseFor : "API_Get_Batch_list", screen:"asas"}
			pure $ "apiDefault"
		API_BatchCreator {user_token:x, api_token:y} -> do
			resData <- getUserDetail x y
			_<- sendUpdatedState {response : resData, responseFor : "API_BatchCreator", screen:"ViewBatchActivity"}
			pure $ "apiCalled"
		API_EnrollInBatch {reqParams : details , user_token : x, api_token: token} -> do
			responseData <- enrollInBatch details x token
			_ <- sendUpdatedState {response : responseData, responseFor : "API_EnrollInBatch", screen:"asas"}
			pure $ "apiDefault"
		BACK_ViewBatchActivity -> case whereFrom of
			"CourseInfoActivity" -> courseInfoActivity whatToSendBack "Terminate" input
			"CourseViewAllActivity" -> courseViewAllActivity whatToSendBack "Terminate" input
			_ -> resourceFragment whatToSendBack "Terminate" input
		_ -> viewBatchActivity input whereFrom whatToSendBack
