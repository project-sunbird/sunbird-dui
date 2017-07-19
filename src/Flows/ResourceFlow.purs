
module Flows.ResourceFlow where

import Control.Monad.Aff
import Prelude (bind, ($), (<>), pure, discard)
import Control.Monad.Except.Trans (runExceptT)
import Utils
import Control.Monad.Eff (Eff)
import Control.Monad.Aff (launchAff)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)
import Data.Foreign.Class (class Decode, class Encode, encode)
import Data.Generic.Rep (class Generic)
import Flows.NotificationFlow
import Flows.FilterFlow
import Data.Foreign.Generic (encodeJSON)
import Control.Monad.Eff.Exception (EXCEPTION)
import Prelude
import Types.UITypes
import Types.APITypes
import UI
import Flows.Commons
import Partial.Unsafe
 
startResourceFlow values = do
	event <- ui $ HomeScreen
	case event of
		StartNotificationFlow -> startNotificationFlow values
		StartResourceDetailFlow {resourceDetails:details} -> startResourceDetailFlow details "ResourceFlow" values
		StartResourceViewAllFlow {resourceDetails:details} -> startResourceViewAllFlow details
		StartSearchFlow {filterDetails: details} -> startResourceSearchFlow details
		ResourceCourseInfoFlow {course : details} -> startCourseDetailFlow details
		StartFilterPageApi{user_token:user_token, api_token:api_key,filter_to_send:delta}  ->	do
																									responseData <- getResourcePageFilterApi user_token api_key delta
																									_ <- sendUpdatedState {response : responseData, responseFor : "StartResourcePageApi", screen:"asas"} 
																									pure $ "handled" 
		_ -> pure $ "default"


startResourceSearchFlow values = do
  liftEff $ log $ "Search FLow started"
  event <- ui $ SearchScreen {filterDetails:values}
  case event of
    ResourceDetailFlow {resourceDetails : details} -> startResourceDetailFlow details "ResourceSearch" values
    StartFilterFlow{filterDetails : details} -> startFilterFlow details 
    SearchResourceFlow {course : details} -> startCourseDetailFlow details
    _ -> pure $ "aborted"




startResourceViewAllFlow rDetails = do
	state <- ui $ ResourceViewAllScreen {resourceDetails : rDetails}
	case state of
		StartResourceInfoFlow {resourceDetails:details} -> startResourceDetailFlow details "ResourceViewAll" rDetails
		StartResourceViewAllDetailFlow {resourceDetails:details} -> startCourseDetailFlow details
		DummyResourceViewAllAction -> pure $ "handled"
		_ -> pure $ "default"

startResourceDetailFlow values fromWhere sendBack= do
	state <- ui $ ResourceDetailScreen {resourceDetails : values}
	case state of
		DummyResourceDetailAction -> pure $ "handled"
		ResourceDetailBack -> case fromWhere of
			"ResourceViewAll" -> startResourceViewAllFlow sendBack
			"ResourceSearch" -> startResourceSearchFlow sendBack
			"ResourceFlow" -> startResourceFlow sendBack
			_ -> startResourceFlow sendBack
		_ -> pure $ "default"

-- --for collection and textbooks
-- resourceEnrolledCourseFlow cDetail= do
-- 	event <- ui $ CourseEnrolledScreen {courseDetails:cDetail}
-- 	case event of
-- 		DummyCourseEnrolledAction -> pure $ "handled"
--   		ShowModuleScreen {moduleName:mName,moduleDetails:mDetails}-> resourceModuleDetailsFlow mName mDetails cDetail
-- 		_ -> pure $ "default"

-- resourceModuleDetailsFlow mName mDetails parentCourse= do
-- 	event <- ui $ ModuleDetailScreen {moduleName:mName,moduleDetails:mDetails}
-- 	case event of
-- 		DummyModuleDetailsAction -> pure $ "handled"
-- 		ShowSubModuleScreen {moduleName:mName,moduleDetails:mDetails}-> resourceSubModuleDetailsFlow mName mDetails parentCourse
-- 		BackToParent -> resourceEnrolledCourseFlow parentCourse
--   		_ -> pure $ "default"

-- resourceSubModuleDetailsFlow mName mDetails parentCourse= do
-- 	event <- ui $ AlternateModuleDetailScreen {moduleName:mName,moduleDetails:mDetails}
-- 	case event of
-- 		DummyAlternateModuleDetailAction -> pure $ "handled"
-- 		ShowModuleAgainScreen {moduleName:mName,moduleDetails:mDetails}-> resourceModuleDetailsFlow mName mDetails parentCourse
-- 		BackToHome -> resourceEnrolledCourseFlow parentCourse
--   		_ -> pure $ "default"  		

