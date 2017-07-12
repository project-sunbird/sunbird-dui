
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
import Flows.ResourceFlow
import Flows.FilterFlow
import Data.Foreign.Generic (encodeJSON)
import Control.Monad.Eff.Exception (EXCEPTION)
import Prelude
import Types.UITypes
import Types.APITypes
import UI
    	
startResourceFlow state = do
	event <- ui $ HomeScreen
	case event of
		StartNotificationFlow -> startNotificationFlow state
		StartResourceDetailFlow {resourceDetails:details} -> startResourceDetailFlow details
		StartResourceViewAllFlow {resourceDetails:details} -> startResourceViewAllFlow details
		StartSearchFlow {filterDetails: details} -> startResourceSearchFlow details
		ResourceCourseInfoFlow {course : details} -> resourceEnrolledCourseFlow details
		_ -> pure $ "default"


startResourceSearchFlow state = do
  liftEff $ log $ "Search FLow started"
  state <- ui $ SearchScreen {filterDetails:state}
  case state of
    ResourceDetailFlow {resourceDetails : details} -> startResourceDetailFlow details
    StartFilterFlow{filterDetails : details} -> startFilterFlow details 
    SearchResourceFlow {course : details} -> resourceEnrolledCourseFlow details
    _ -> pure $ "aborted"


startResourceDetailFlow state = do
	state <- ui $ ResourceDetailScreen {resourceDetails : state}
	case state of
		DummyResourceDetailAction -> pure $ "handled"
		_ -> pure $ "default"


startResourceViewAllFlow state = do
	state <- ui $ ResourceViewAllScreen {resourceDetails : state}
	case state of
		StartResourceInfoFlow {resourceDetails:details} -> startResourceDetailFlow details
		StartResourceViewAllDetailFlow {resourceDetails:details} -> resourceEnrolledCourseFlow details
		DummyResourceViewAllAction -> pure $ "handled"
		_ -> pure $ "default"


resourceEnrolledCourseFlow cDetail= do
	event <- ui $ CourseEnrolledScreen {courseDetails:cDetail}
	case event of
		DummyCourseEnrolledAction -> pure $ "handled"
  		ShowModuleScreen {moduleName:mName,moduleDetails:mDetails}-> resourceModuleDetailsFlow mName mDetails cDetail
		_ -> pure $ "default"

resourceModuleDetailsFlow mName mDetails parentCourse= do
	event <- ui $ ModuleDetailScreen {moduleName:mName,moduleDetails:mDetails}
	case event of
		DummyModuleDetailsAction -> pure $ "handled"
		ShowSubModuleScreen {moduleName:mName,moduleDetails:mDetails}-> resourceSubModuleDetailsFlow mName mDetails parentCourse
		BackToParent -> resourceEnrolledCourseFlow parentCourse
  		_ -> pure $ "default"

resourceSubModuleDetailsFlow mName mDetails parentCourse= do
	event <- ui $ AlternateModuleDetailScreen {moduleName:mName,moduleDetails:mDetails}
	case event of
		DummyAlternateModuleDetailAction -> pure $ "handled"
		ShowModuleAgainScreen {moduleName:mName,moduleDetails:mDetails}-> resourceModuleDetailsFlow mName mDetails parentCourse
		BackToHome -> resourceEnrolledCourseFlow parentCourse
  		_ -> pure $ "default"  		

