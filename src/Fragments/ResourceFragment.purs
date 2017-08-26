
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
		API_FilterPage{user_token:user_token, api_token:api_key,filter_to_send:delta}  ->	do
			responseData <- getResourcePageFilterApi user_token api_key delta
			_ <- sendUpdatedState {response : responseData, responseFor : "API_FilterPage", screen:"asas", filter_to_send:delta}
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
			responseData <- getProfileDetail user_token api_token
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
