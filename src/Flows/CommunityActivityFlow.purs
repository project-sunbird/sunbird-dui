module Flows.CommunityActivityFlow where

import Prelude (bind, ($), (<>), discard)
import Utils
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)
import Control.Monad.Eff.Console
import Control.Monad.Eff.Class(liftEff)


communityActivityFlow state = do
  --reqTokens <- getReqTokens
  --responseData <- getUserCourses "user1"
  --response <- getCourses reqTokens
  --state <- updateState {response: responseData} state
  --_ <- sendUpdatedState state
  state <- getCallbackFromScreen "HOME" state
  case state.action of
    "showCommunityInfo" -> do
      liftEff $ log "showCommunityInfoFlow"
      showCommunityInfoFlow state
    "showAll" -> do
      liftEff $ log "showAll"
      showCommunityViewAllFlow state
    _ -> communityActivityFlow state

showCommunityInfoFlow state = do
  state <- showUI "COMMUNITY_INFO_SCREEN" state
  case state.action of
    "goBack" -> do
      liftEff $ log "communityActivityFlow"
      communityActivityFlow state
    _ ->showCommunityInfoFlow state

showCommunityViewAllFlow state = do
  state <- showUI "COMMUNITY_VIEW_ALL_SCREEN" state
  case state.action of
    "goBack" -> do
      liftEff $ log "communityActivityFlow"
      communityActivityFlow state
    _ ->showCommunityInfoFlow state

