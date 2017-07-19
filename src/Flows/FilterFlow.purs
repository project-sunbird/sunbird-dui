
module Flows.FilterFlow where

import Control.Monad.Aff
import Prelude (bind, ($), (<>), pure, discard)
import Control.Monad.Except.Trans (runExceptT)
import Utils
import Control.Monad.Eff (Eff)
import Control.Monad.Aff (launchAff)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)
import Data.Foreign.Class (class Decode, class Encode, encode)
import Data.Maybe
import Data.Generic.Rep (class Generic)
import Data.Foreign.Generic (encodeJSON)
import Control.Monad.Eff.Exception (EXCEPTION)
import Prelude
import Types.UITypes
import UI
import Flows.Commons


startFilterFlow state = do
  liftEff $ log $ "Search FLow started"
  event <- ui $ FilterScreen {filterDetails : state}
  case event of
    SearchScreenFromFilter {filterData: details} -> startFilterSearchFlow details	
    _ -> pure $ "aborted"



startFilterSearchFlow state = do
  liftEff $ log $ "Search FLow<><><><><>< started"
  state <- ui $ SearchScreen {filterDetails : state}
  case state of
    ResourceDetailFlow {resourceDetails : details} -> resourceDetailFlow details
    StartFilterFlow{filterDetails : details} -> startFilterFlow details 
    SearchResourceFlow {course : details} -> do 
      liftEff $ log $ "for courses in filter"
      startCourseDetailFlow details
    _ -> pure $ "aborted"


-- resourceDetailFlow state = do
-- 	state <- ui $ ResourceDetailScreen {resourceDetails : state}
-- 	case state of
-- 		DummyResourceDetailAction -> pure $ "handled"
-- 		_ -> pure $ "default"

-- startCourseDetailFlow cDetail= do
--   event <- ui $ CourseEnrolledScreen {courseDetails:cDetail}
--   case event of
--     DummyCourseEnrolledAction -> pure $ "handled"
--     ShowModuleScreen {moduleName:mName,moduleDetails:mDetails}-> resourceModuleDetailsFlow mName mDetails cDetail
--     _ -> pure $ "default"

-- resourceModuleDetailsFlow mName mDetails parentCourse= do
--   event <- ui $ ModuleDetailScreen {moduleName:mName,moduleDetails:mDetails}
--   case event of
--     DummyModuleDetailsAction -> pure $ "handled"
--     ShowSubModuleScreen {moduleName:mName,moduleDetails:mDetails}-> resourceSubModuleDetailsFlow mName mDetails parentCourse
--     BackToParent -> startCourseDetailFlow parentCourse
--     _ -> pure $ "default"

-- resourceSubModuleDetailsFlow mName mDetails parentCourse= do
--   event <- ui $ AlternateModuleDetailScreen {moduleName:mName,moduleDetails:mDetails}
--   case event of
--     DummyAlternateModuleDetailAction -> pure $ "handled"
--     ShowModuleAgainScreen {moduleName:mName,moduleDetails:mDetails}-> resourceModuleDetailsFlow mName mDetails parentCourse
--     BackToHome -> startCourseDetailFlow parentCourse
--     _ -> pure $ "default"     
