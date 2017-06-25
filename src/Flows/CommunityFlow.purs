module Flows.CommunityFlow where

import Prelude (bind, ($), (<>), discard,pure)
import Utils
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)


startCommunityFlow state = do
  pure $ "handled"
  --reqTokens <- getReqTokens
  --responseData <- getUserCourses "user1"
  --response <- getCourses reqTokens
  --state <- updateState {response: responseData} state
  --_ <- sendUpdatedState state
--   state <- getCallbackFromScreen "HOME" state
--   case state.action of
--     "showCommunityInfo" -> do
--       liftEff $ log "showCommunityInfoFlow"
--       showCommunityInfoFlow state
--       pure $ "showCommunityInfo handled"
--     "showAll" -> do
--       liftEff $ log "showAll"
--       showCommunityViewAllFlow state
--       pure $ "showCommunityViewAllFlow handled"
--     _ -> startCommunityFlow state
--          pure $ "action not handled"

-- showCommunityInfoFlow state = do
--   state <- showUI "COMMUNITY_INFO_SCREEN" state
--   case state.action of
--     "goBack" -> do
--       liftEff $ log "startCommunityFlow"
--       startCommunityFlow state
--       pure $ "startCommunityFlow handled"
--     _ ->showCommunityInfoFlow state
--         pure $ "action not handled"

-- showCommunityViewAllFlow state = do
--   state <- showUI "COMMUNITY_VIEW_ALL_SCREEN" state
--   case state.action of
--     "goBack" -> do
--       liftEff $ log "startCommunityFlow"
--       startCommunityFlow state
--       pure $ "startCommunityFlow handled"
--     _ ->showCommunityInfoFlow state
--         pure $ "action not handled"







